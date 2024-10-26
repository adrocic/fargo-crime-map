import { Injectable, Logger } from '@nestjs/common';
import { CouchDbService } from 'src/services/couchdb/couchdb.service';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import * as NodeCache from 'node-cache'; // For in-memory caching
import { Client } from '@googlemaps/google-maps-services-js';
import { BadRequestException } from '@nestjs/common';
import { parseISO, differenceInCalendarDays } from 'date-fns';
import pLimit from 'p-limit';

@Injectable()
export class DispatchService {
  private readonly logger = new Logger(DispatchService.name);
  private googleMapsClient = new Client({});
  private geocodeCache = new NodeCache({ stdTTL: 86400 }); // Cache for 1 day

  constructor(private readonly couchDbService: CouchDbService) {}

  // Schedule the daily dispatch log fetch at 11:59:59 PM
  @Cron('59 59 23 * * *')
  async fetchDailyDispatchLogs() {
    const today = new Date().toISOString().split('T')[0];
    const rangeId = `dispatch_${today}`;
    this.logger.log(`Fetching dispatch logs for ${today}`);

    try {
      const response = await axios.get(
        `https://fargond.gov/dispatchLogs?startDate=${today}&endDate=${today}`,
      );
      const logs = await this.processDispatchLogs(response.data);

      // Cache the fetched dispatch logs
      await this.couchDbService.cacheDispatchLogs(rangeId, logs);
      this.logger.log(`Dispatch logs cached for ${today}`);
    } catch (error) {
      this.logger.error('Error fetching dispatch logs:', error);
    }
  }

  // Process dispatch logs: geocode addresses and handle geocoding errors
  private async processDispatchLogs(data: any[]): Promise<any[]> {
    const limit = pLimit(5); // Limit to 5 concurrent requests (adjust as needed)

    const tasks = data.map((item) =>
      limit(async () => {
        const address = `${item.Address}, Fargo, ND`;

        // Check if the address is already cached
        let cachedLocation: { lat: number; lon: number } =
          this.geocodeCache.get(address);

        if (!cachedLocation) {
          // Fetch from CouchDB cache if not in memory
          cachedLocation = await this.couchDbService.getCachedGeocode(address);
        }

        if (!cachedLocation) {
          try {
            // Geocode the address using Google Maps API
            const geocodeResponse = await this.googleMapsClient.geocode({
              params: {
                address,
                key: process.env.GOOGLE_MAPS_API_KEY,
              },
            });

            if (geocodeResponse.data.results.length === 0) {
              this.logger.warn(`Geocoding failed for address: ${address}`);
              return null; // Skip this entry if geocoding fails
            }

            const location = geocodeResponse.data.results[0].geometry.location;

            // Cache the geocoded address in memory and CouchDB
            cachedLocation = {
              lat: location.lat,
              lon: location.lng,
            };
            this.geocodeCache.set(address, cachedLocation);
            await this.couchDbService.cacheGeocode(
              address,
              location.lat,
              location.lng,
            );
          } catch (error) {
            this.logger.error(`Geocoding error for address ${address}:`, error);
            return null;
          }
        }

        // Return the processed data with geocoded coordinates
        return {
          ...item,
          latitude: cachedLocation.lat,
          longitude: cachedLocation.lon,
        };
      }),
    );

    // Execute tasks with concurrency limit
    const results = await Promise.all(tasks);
    return results.filter((item) => item !== null);
  }

  // Method to serve cached dispatch logs or fetch from API if not cached
  async getDispatchLogs(startDate: string, endDate: string): Promise<any[]> {
    // Parse dates in UTC to avoid timezone issues
    const start = parseISO(startDate);
    const end = parseISO(endDate);

    // Validate that the dates are valid
    if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) {
      this.logger.warn(
        `Invalid date format: startDate=${startDate}, endDate=${endDate}`,
      );
      throw new BadRequestException(
        'Invalid date format. Please provide valid dates.',
      );
    }

    // Check if end date is before start date
    if (end < start) {
      this.logger.warn(
        `End date before start date: startDate=${startDate}, endDate=${endDate}`,
      );
      throw new BadRequestException('End date cannot be before start date.');
    }

    // Calculate the difference in days, inclusive of both start and end dates
    const dayDifference = differenceInCalendarDays(end, start) + 1;

    // Validate the date range does not exceed 2 days
    if (dayDifference > 2) {
      this.logger.warn(
        `Date range exceeds limit: startDate=${startDate}, endDate=${endDate}, days=${dayDifference}`,
      );
      throw new BadRequestException(
        `Date range from ${startDate} to ${endDate} exceeds the maximum allowed range of 2 days.`,
      );
    }

    const rangeId = `dispatch_${startDate}_to_${endDate}`;

    // Try to get cached logs
    const cachedLogs = await this.couchDbService.getCachedDispatchLogs(rangeId);
    if (cachedLogs) {
      this.logger.log(`Serving cached dispatch logs for range ${rangeId}`);
      return cachedLogs;
    }

    // If not cached, fetch from API and cache
    try {
      const response = await axios.get(
        `https://fargond.gov/dispatchLogs?startDate=${startDate}&endDate=${endDate}`,
      );
      const logs = await this.processDispatchLogs(response.data);
      await this.couchDbService.cacheDispatchLogs(rangeId, logs); // Cache logs
      return logs;
    } catch (error) {
      this.logger.error('Error fetching dispatch logs:', error);
      throw new Error('Failed to fetch dispatch logs.');
    }
  }
}
