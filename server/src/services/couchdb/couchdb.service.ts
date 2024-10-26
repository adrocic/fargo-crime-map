import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as nano from 'nano'; // Import nano for CouchDB

@Injectable()
export class CouchDbService implements OnModuleInit {
  private readonly logger = new Logger(CouchDbService.name);
  private couch: nano.ServerScope;
  private osmTilesDB: nano.DocumentScope<any>;
  private dispatchLogsDB: nano.DocumentScope<any>;
  private geocodeDB: nano.DocumentScope<any>;

  constructor() {
    // Initialize CouchDB connection using environment variables
    const couchDbUrl = process.env.COUCHDB_URL;
    const couchDbUsername = process.env.COUCHDB_USERNAME;
    const couchDbPassword = process.env.COUCHDB_PASSWORD;

    if (!couchDbUrl || !couchDbUsername || !couchDbPassword) {
      throw new Error(
        'CouchDB configuration is missing. Please set COUCHDB_URL, COUCHDB_USERNAME, and COUCHDB_PASSWORD environment variables.',
      );
    }

    this.couch = nano({
      url: couchDbUrl,
      requestDefaults: {
        auth: {
          username: couchDbUsername,
          password: couchDbPassword,
        },
      },
    });
  }

  // Initialize databases after module is initialized
  async onModuleInit() {
    try {
      await this.ensureDatabase('osm_tiles');
      await this.ensureDatabase('dispatch_logs');
      await this.ensureDatabase('geocode_cache');

      this.osmTilesDB = this.couch.db.use('osm_tiles');
      this.dispatchLogsDB = this.couch.db.use('dispatch_logs');
      this.geocodeDB = this.couch.db.use('geocode_cache');

      this.logger.log('CouchDB databases initialized successfully');
    } catch (error) {
      this.logger.error('Error initializing CouchDB databases:', error);
      throw error;
    }
  }

  // Helper method to ensure a database exists
  private async ensureDatabase(dbName: string): Promise<void> {
    try {
      await this.couch.db.get(dbName);
      this.logger.log(`Database '${dbName}' already exists`);
    } catch (error) {
      if (error.statusCode === 404) {
        await this.couch.db.create(dbName);
        this.logger.log(`Created database '${dbName}'`);
      } else {
        this.logger.error(`Error checking database '${dbName}':`, error);
        throw error;
      }
    }
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
      this.logger.error(`Error inserting tile with id '${tileId}':`, error);
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
      this.logger.error(`Error fetching tile with id '${tileId}':`, error);
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
      this.logger.error(
        `Error caching dispatch logs for range '${rangeId}':`,
        error,
      );
      throw error;
    }
  }

  // Fetch cached dispatch logs
  async getCachedDispatchLogs(rangeId: string): Promise<any | null> {
    try {
      const doc = await this.dispatchLogsDB.get(rangeId);
      this.logger.log(`Fetched cached dispatch logs for range ${rangeId}`);
      return doc.logs;
    } catch (error) {
      if (error.statusCode === 404) {
        this.logger.warn(`No cached dispatch logs found for range: ${rangeId}`);
        return null;
      }
      this.logger.error(
        `Error fetching cached dispatch logs for range '${rangeId}':`,
        error,
      );
      throw error;
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
      this.logger.log(`Geocode cached for address '${address}'`);
    } catch (error) {
      this.logger.error(
        `Error caching geocode for address '${address}':`,
        error,
      );
      throw error;
    }
  }

  // Fetch cached geocode
  async getCachedGeocode(
    address: string,
  ): Promise<{ lat: number; lon: number } | null> {
    try {
      const doc = await this.geocodeDB.get(address);
      this.logger.log(`Fetched cached geocode for address '${address}'`);
      return { lat: doc.lat, lon: doc.lon };
    } catch (error) {
      if (error.statusCode === 404) {
        this.logger.warn(`No cached geocode found for address: '${address}'`);
        return null;
      }
      this.logger.error(
        `Error fetching cached geocode for address '${address}':`,
        error,
      );
      throw error;
    }
  }
}
