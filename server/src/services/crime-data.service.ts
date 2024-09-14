// src/services/crime-data.service.ts
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// src/services/crime-data.service.ts*
import * as dotenv from 'dotenv';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Client } from '@googlemaps/google-maps-services-js';
import { CrimeDataProps } from '../modules/crime-data.module';
import * as NodeCache from 'node-cache'; // For caching the geocoded addresses
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

@Injectable()
export class CrimeDataService {
  private googleMapsClient = new Client({});
  private geocodeCache = new NodeCache({ stdTTL: 86400 }); // Cache for 1 day

  // Get crime data and geocode the address to latitude and longitude
  async getCrimeData(startDate, endDate, callType): Promise<CrimeDataProps[]> {
    try {
      // Your API URL for fetching crime data (replace with your actual URL)
      let url = `https://fargond.gov/dispatchLogs?startDate=${startDate}&endDate=${endDate}`;

      if (callType) {
        url += `&callType=${encodeURIComponent(callType)}`;
      }

      const response = await axios.get(url);
      const data = response.data;

      // Geocode addresses with caching
      const geocodedData = await Promise.all(
        data.map(async (item) => {
          const address = `${item.Address}, Fargo, ND`;

          // Check cache first
          let cachedLocation = this.geocodeCache.get(address);

          if (!cachedLocation) {
            try {
              // Call Google Maps Geocoding API
              const geocodeResponse = await this.googleMapsClient.geocode({
                params: {
                  address,
                  key: process.env.GOOGLE_MAPS_API_KEY,
                },
              });

              if (geocodeResponse.data.results.length === 0) {
                console.warn(`Geocoding failed for address: ${address}`);
                return null; // Skip if geocoding fails
              }

              const location =
                geocodeResponse.data.results[0].geometry.location;

              // Cache the geocoded address
              cachedLocation = {
                latitude: location.lat,
                longitude: location.lng,
              };
              this.geocodeCache.set(address, cachedLocation);
            } catch (error) {
              console.error('Geocoding error:', error);
              return null; // Skip if there's an error
            }
          }

          return {
            ...item, // Include the original crime data
            latitude: (cachedLocation as any).latitude,
            longitude: (cachedLocation as any).longitude,
          };
        }),
      );

      // Filter out any entries that failed to geocode
      return geocodedData.filter((item) => item !== null);
    } catch (error) {
      console.error('Error fetching or processing crime data:', error);
      return [];
    }
  }
}
