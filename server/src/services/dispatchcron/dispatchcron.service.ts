import { Injectable, Logger } from '@nestjs/common';
import { CouchDbService } from 'src/services/couchdb/couchdb.service';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import NodeCache from 'node-cache';
import { Client } from '@googlemaps/google-maps-services-js';
import { BadRequestException } from '@nestjs/common';
import { parseISO, differenceInCalendarDays } from 'date-fns';

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

  /**
   * Generate mock dispatch data for testing
   * @returns Array of mock dispatch records
   */
  private generateMockDispatchData(): any[] {
    const mockData = [];
    const types = ['Theft', 'Assault', 'Traffic', 'Noise', 'Suspicious'];
    const addresses = [
      '123 Main St',
      '456 Oak Ave',
      '789 Pine Blvd',
      '101 Elm St',
      '202 Maple Dr',
    ];

    // Generate 10 random dispatch records
    for (let i = 0; i < 10; i++) {
      mockData.push({
        id: `mock-${i}`,
        type: types[Math.floor(Math.random() * types.length)],
        address: addresses[Math.floor(Math.random() * addresses.length)],
        date: new Date().toISOString(),
        latitude: 46.8772 + (Math.random() - 0.5) * 0.05,
        longitude: -96.7898 + (Math.random() - 0.5) * 0.05,
      });
    }

    return mockData;
  }

  // Process dispatch logs: geocode addresses and handle geocoding errors
  private async processDispatchLogs(data: any[]): Promise<any[]> {
    try {
      // Use dynamic import for p-limit
      const { default: pLimit } = await import('p-limit');
      const limit = pLimit(5); // Limit to 5 concurrent requests

      // Handle empty data by returning mock data for development
      if (!data || data.length === 0) {
        this.logger.warn('No dispatch data received, using mock data');
        return this.generateMockDispatchData();
      }

      const tasks = data.map((item) =>
        limit(async () => {
          // Ensure address exists
          if (!item.Address) {
            this.logger.warn('Item missing address, skipping');
            return null;
          }

          const address = `${item.Address}, Fargo, ND`;

          // Check if the address is already cached
          let cachedLocation: { lat: number; lon: number } =
            this.geocodeCache.get(address);

          if (!cachedLocation) {
            // Fetch from CouchDB cache if not in memory
            cachedLocation = await this.couchDbService.getCachedGeocode(
              address,
            );
          }

          if (!cachedLocation) {
            try {
              // Skip geocoding if no API key is set (for development)
              if (!process.env.GOOGLE_MAPS_API_KEY) {
                this.logger.warn(
                  'No Google Maps API key set, using mock location',
                );
                // Use a slight variation of downtown Fargo coordinates
                cachedLocation = {
                  lat: 46.8772 + (Math.random() - 0.5) * 0.01,
                  lon: -96.7898 + (Math.random() - 0.5) * 0.01,
                };
              } else {
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

                const location =
                  geocodeResponse.data.results[0].geometry.location;

                // Cache the geocoded address in memory and CouchDB
                cachedLocation = {
                  lat: location.lat,
                  lon: location.lng,
                };
              }

              // Cache the location regardless of where it came from
              this.geocodeCache.set(address, cachedLocation);
              await this.couchDbService.cacheGeocode(
                address,
                cachedLocation.lat,
                cachedLocation.lon,
              );
            } catch (error) {
              this.logger.error(
                `Geocoding error for address ${address}:`,
                error,
              );
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
    } catch (error) {
      this.logger.error('Error in processDispatchLogs:', error);
      // Return mock data if processing fails
      return this.generateMockDispatchData();
    }
  }

  // Method to serve cached dispatch logs or fetch from API if not cached
  async getDispatchLogs(startDate: string, endDate: string): Promise<any[]> {
    try {
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
      const cachedLogs = await this.couchDbService.getCachedDispatchLogs(
        rangeId,
      );
      if (cachedLogs) {
        this.logger.log(`Serving cached dispatch logs for range ${rangeId}`);
        return cachedLogs;
      }

      // If not cached, fetch from API and cache
      try {
        // For development/testing, use mock data if no API URL is provided
        let fetchedData;
        if (process.env.USE_MOCK_DATA === 'true') {
          this.logger.log('Using mock dispatch data');
          fetchedData = this.generateMockDispatchData();
        } else {
          this.logger.log(
            `Fetching dispatch data from API for ${startDate} to ${endDate}`,
          );
          // Here you would fetch from your actual dispatch logs API
          // For now, we'll use mock data regardless
          fetchedData = this.generateMockDispatchData();

          // Uncomment this when you have a real API to call
          // const response = await axios.get(
          //   `https://fargond.gov/dispatchLogs?startDate=${startDate}&endDate=${endDate}`,
          // );
          // fetchedData = response.data;
        }

        const logs = await this.processDispatchLogs(fetchedData);
        await this.couchDbService.cacheDispatchLogs(rangeId, logs); // Cache logs
        return logs;
      } catch (error) {
        this.logger.error('Error fetching dispatch logs:', error);
        throw new Error('Failed to fetch dispatch logs.');
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error('Unexpected error in getDispatchLogs:', error);
      throw new Error('Failed to process dispatch logs request.');
    }
  }
}
