import { Injectable, Logger } from '@nestjs/common';
import * as nano from 'nano'; // Import nano for CouchDB

@Injectable()
export class CouchDbService {
  private readonly logger = new Logger(CouchDbService.name);
  private readonly couch;
  private readonly osmTilesDB;
  private readonly dispatchLogsDB;
  private readonly geocodeDB;

  constructor() {
    // Connect to CouchDB (ensure this matches your Docker CouchDB credentials)
    this.couch = nano('http://admin:password@localhost:5984');

    this.couch.db.get('osm_tiles').catch(async () => {
      await this.couch.db.create('osm_tiles');
      this.logger.log('Created `osm_tiles` database');
    });

    this.couch.db.get('dispatch_logs').catch(async () => {
      await this.couch.db.create('dispatch_logs');
      this.logger.log('Created `dispatch_logs` database');
    });

    this.couch.db.get('geocode_cache').catch(async () => {
      await this.couch.db.create('geocode_cache');
      this.logger.log('Created `geocode_cache` database');
    });

    this.osmTilesDB = this.couch.db.use('osm_tiles');
    this.dispatchLogsDB = this.couch.db.use('dispatch_logs');
    this.geocodeDB = this.couch.db.use('geocode_cache');
  }

  // Function to insert a new tile into CouchDB
  async insertTile(tileId: string, imageData: Buffer): Promise<any> {
    try {
      const response = await this.osmTilesDB.insert({
        _id: tileId,
        image_data: imageData.toString('base64'), // Convert to base64 for CouchDB
        created_at: new Date().toISOString(),
      });
      this.logger.log(`Tile inserted with id: ${response.id}`);
      return response;
    } catch (error) {
      this.logger.error('Error inserting tile:', error);
      throw error;
    }
  }

  // Function to fetch a tile from CouchDB
  async getTile(tileId: string): Promise<Buffer | null> {
    try {
      const tile = await this.osmTilesDB.get(tileId);
      this.logger.log(`Serving cached tile with id: ${tileId}`);
      return Buffer.from(tile.image_data, 'base64'); // Convert from base64 to Buffer
    } catch (error) {
      if (error.statusCode === 404) {
        this.logger.warn(`Tile not found with id: ${tileId}`);
        return null;
      }
      this.logger.error('Error fetching tile:', error);
      throw error;
    }
  }
  // Cache dispatch logs
  async cacheDispatchLogs(rangeId: string, logs: any): Promise<void> {
    try {
      await this.dispatchLogsDB.insert({
        _id: rangeId,
        logs,
        cached_at: new Date().toISOString(),
      });
      this.logger.log(`Dispatch logs cached for range ${rangeId}`);
    } catch (error) {
      this.logger.error('Error caching dispatch logs:', error);
    }
  }

  // Fetch cached dispatch logs
  async getCachedDispatchLogs(rangeId: string): Promise<any> {
    try {
      const doc = await this.dispatchLogsDB.get(rangeId);
      return doc.logs;
    } catch (error) {
      if (error.statusCode === 404) {
        return null;
      }
      this.logger.error('Error fetching cached dispatch logs:', error);
    }
  }

  // Cache geocoded addresses
  async cacheGeocode(address: string, lat: number, lon: number): Promise<void> {
    try {
      await this.geocodeDB.insert({
        _id: address,
        lat,
        lon,
        cached_at: new Date().toISOString(),
      });
      this.logger.log(`Geocode cached for address ${address}`);
    } catch (error) {
      this.logger.error('Error caching geocode:', error);
    }
  }

  // Fetch cached geocode
  async getCachedGeocode(
    address: string,
  ): Promise<{ lat: number; lon: number } | null> {
    try {
      const doc = await this.geocodeDB.get(address);
      return { lat: doc.lat, lon: doc.lon };
    } catch (error) {
      if (error.statusCode === 404) {
        return null;
      }
      this.logger.error('Error fetching cached geocode:', error);
    }
  }
}
