// src/services/maptiles/maptiles.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { CouchDbService } from 'src/services/couchdb/couchdb.service';
import axios from 'axios';
import * as crypto from 'crypto';
import pLimit from 'p-limit';

@Injectable()
export class MapTilesService {
  private readonly logger = new Logger(MapTilesService.name);

  // Limit the number of concurrent requests
  private readonly limit = pLimit(5); // Adjust the concurrency limit as needed

  constructor(private readonly couchDbService: CouchDbService) {}

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

    // If not cached, use p-limit to control concurrency
    return this.limit(async () => {
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
}
