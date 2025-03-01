import { Injectable, Logger } from '@nestjs/common';
import nano from 'nano'; // Import nano for CouchDB

@Injectable()
export class CouchDbService {
  private readonly logger = new Logger(CouchDbService.name);
  private couch: any;
  private osmTilesDB: any;
  private dispatchLogsDB: any;
  private geocodeDB: any;

  constructor() {
    // Initialize connection to CouchDB
    this.initCouchDb();
  }

  private async initCouchDb() {
    try {
      // Default development configuration
      const couchDbUrl = process.env.COUCHDB_URL || 'http://localhost:5984';
      const couchDbUsername = process.env.COUCHDB_USERNAME || 'admin';
      const couchDbPassword = process.env.COUCHDB_PASSWORD || 'password';

      this.logger.log('Connecting to CouchDB...');

      // Initialize nano with the provided credentials
      if (couchDbUsername && couchDbPassword) {
        this.couch = nano({
          url: couchDbUrl,
          requestDefaults: {
            auth: {
              username: couchDbUsername,
              password: couchDbPassword,
            },
          },
        });
      } else {
        // Fallback to URL-only configuration (for development)
        this.couch = nano(couchDbUrl);
      }

      // Test the connection
      try {
        await this.couch.db.list();
        this.logger.log('Successfully connected to CouchDB');
      } catch (connError) {
        this.logger.warn(
          'CouchDB connection test failed, but proceeding anyway:',
          connError.message,
        );
        this.logger.warn(
          'You may need to start a CouchDB server or adjust environment variables',
        );
        // We'll still attempt to set up the databases in case they work later
      }

      // Create or verify existence of required databases
      await this.ensureDatabase('osm_tiles');
      await this.ensureDatabase('dispatch_logs');
      await this.ensureDatabase('geocode_cache');

      this.osmTilesDB = this.couch.db.use('osm_tiles');
      this.dispatchLogsDB = this.couch.db.use('dispatch_logs');
      this.geocodeDB = this.couch.db.use('geocode_cache');

      this.logger.log('CouchDB databases initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize CouchDB:', error);
      this.logger.warn('CouchDB-dependent features may not work correctly');

      // Create fallback empty database objects
      this.osmTilesDB = {
        get: () => Promise.reject({ statusCode: 404 }),
        insert: () => Promise.reject(new Error('CouchDB not available')),
      };
      this.dispatchLogsDB = {
        get: () => Promise.reject({ statusCode: 404 }),
        insert: () => Promise.reject(new Error('CouchDB not available')),
      };
      this.geocodeDB = {
        get: () => Promise.reject({ statusCode: 404 }),
        insert: () => Promise.reject(new Error('CouchDB not available')),
      };
    }
  }

  // Helper method to ensure a database exists - now with error handling
  private async ensureDatabase(dbName: string): Promise<void> {
    try {
      await this.couch.db.get(dbName);
      this.logger.log(`Database '${dbName}' already exists`);
    } catch (error) {
      if (error.statusCode === 404) {
        try {
          await this.couch.db.create(dbName);
          this.logger.log(`Created database '${dbName}'`);
        } catch (createError) {
          this.logger.error(
            `Failed to create database '${dbName}':`,
            createError.message,
          );
        }
      } else {
        this.logger.error(
          `Error checking database '${dbName}':`,
          error.message,
        );
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
      this.logger.debug(`Tile inserted with id: ${response.id}`);
      return response;
    } catch (error) {
      this.logger.error(
        `Error inserting tile with id '${tileId}':`,
        error.message,
      );
      return null; // Return null instead of throwing to prevent application crashes
    }
  }

  // Function to fetch a tile from CouchDB
  async getTile(tileId: string): Promise<Buffer | null> {
    try {
      const tile = await this.osmTilesDB.get(tileId);
      this.logger.debug(`Serving cached tile with id: ${tileId}`);
      return Buffer.from(tile.image_data, 'base64'); // Convert from base64 to Buffer
    } catch (error) {
      if (error.statusCode === 404) {
        this.logger.debug(`Tile not found with id: ${tileId}`);
        return null;
      }
      this.logger.error(
        `Error fetching tile with id '${tileId}':`,
        error.message,
      );
      return null;
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
        error.message,
      );
      // Don't throw, just log the error
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
      } else {
        this.logger.error(
          `Error fetching cached dispatch logs for range '${rangeId}':`,
          error.message,
        );
      }
      return null;
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
      this.logger.debug(`Geocode cached for address '${address}'`);
    } catch (error) {
      this.logger.error(
        `Error caching geocode for address '${address}':`,
        error.message,
      );
      // Don't throw, just log the error
    }
  }

  // Fetch cached geocode
  async getCachedGeocode(
    address: string,
  ): Promise<{ lat: number; lon: number } | null> {
    try {
      const doc = await this.geocodeDB.get(address);
      this.logger.debug(`Fetched cached geocode for address '${address}'`);
      return { lat: doc.lat, lon: doc.lon };
    } catch (error) {
      if (error.statusCode === 404) {
        this.logger.debug(`No cached geocode found for address: '${address}'`);
      } else {
        this.logger.error(
          `Error fetching cached geocode for address '${address}':`,
          error.message,
        );
      }
      return null;
    }
  }
}
