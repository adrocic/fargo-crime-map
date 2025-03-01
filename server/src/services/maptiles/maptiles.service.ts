// src/services/maptiles/maptiles.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { CouchDbService } from 'src/services/couchdb/couchdb.service';
import axios from 'axios';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

// Remove the type definition here and import dynamically when needed
// type PLimit = (concurrency: number) => <T>(fn: () => Promise<T>, ...args: any[]) => Promise<T>;

@Injectable()
export class MapTilesService {
  private readonly logger = new Logger(MapTilesService.name);
  private readonly staticPath = path.join(process.cwd(), 'static');
  // Don't define limit as a class property since it's dynamically imported

  constructor(private readonly couchDbService: CouchDbService) {
    // Remove p-limit initialization here
  }

  // Function to generate a hash for the tile URL (for use as _id)
  private hashTileUrl(url: string): string {
    return crypto.createHash('md5').update(url).digest('hex');
  }

  // Function to get a tile, either from cache or by fetching from OSM
  async getTile(z: number, x: number, y: number): Promise<Buffer> {
    const tileUrl = `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;
    const tileId = this.hashTileUrl(tileUrl);

    // Try fetching the tile from CouchDB cache
    const cachedTile = await this.couchDbService.getTile(tileId);

    if (cachedTile) {
      this.logger.debug(`Serving cached tile for ${tileUrl}`);
      return cachedTile;
    }

    // Dynamically import p-limit inside the method when needed
    const { default: pLimit } = await import('p-limit');
    const limit = pLimit(5); // Create a new limit function each time

    // Use the local limit variable instead of this.limit
    return limit(async () => {
      // Check the cache again in case another request already fetched it
      const cachedTileAfterLimit = await this.couchDbService.getTile(tileId);
      if (cachedTileAfterLimit) {
        this.logger.debug(
          `Serving cached tile for ${tileUrl} after concurrency check`,
        );
        return cachedTileAfterLimit;
      }

      // Fetch the tile from OpenStreetMap
      try {
        const response = await axios.get(tileUrl, {
          responseType: 'arraybuffer',
        });
        const tileData = Buffer.from(response.data);

        // Insert the tile into CouchDB cache
        await this.couchDbService.insertTile(tileId, tileData);
        this.logger.debug(`Fetched and cached tile from ${tileUrl}`);

        return tileData;
      } catch (error) {
        this.logger.error(`Error fetching tile from ${tileUrl}:`, error);
        throw new Error('Error fetching tile from OpenStreetMap');
      }
    });
  }

  async getMaptile(z: string, x: string, y: string): Promise<Buffer> {
    try {
      // Dynamic import of p-limit
      const { default: pLimit } = await import('p-limit');
      const limit = pLimit(5); // Limit concurrent file operations

      const tilePath = path.join(this.staticPath, 'maptiles', z, x, `${y}.png`);
      const readFile = promisify(fs.readFile);

      return await limit(() => readFile(tilePath));
    } catch (error) {
      throw new Error(`Failed to get maptile: ${error.message}`);
    }
  }
}
