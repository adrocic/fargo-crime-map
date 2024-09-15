import { Controller, Get, Logger, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { CouchDbService } from 'src/services/couchdb/couchdb.service'; // Import the CouchDB service
import axios from 'axios';
import * as crypto from 'crypto';

@Controller('maptiles')
export class MaptilesController {
  private readonly logger = new Logger(MaptilesController.name);
  constructor(private readonly couchDbService: CouchDbService) {}

  // Function to generate a hash for the tile URL (for use as _id)
  private hashTileUrl(url: string): string {
    const tileId = crypto.createHash('md5').update(url).digest('hex');
    this.logger.log(`Generated tile ID for URL ${url}: ${tileId}`);
    return tileId;
  }

  @Get('/tile/:z/:x/:y.png')
  async getTile(
    @Param('z') z: number,
    @Param('x') x: number,
    @Param('y') y: number,
    @Res() res: Response,
  ) {
    const tileUrl = `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;
    const tileId = this.hashTileUrl(tileUrl);

    // Try fetching the tile from CouchDB cache
    const cachedTile = await this.couchDbService.getTile(tileId);

    if (cachedTile) {
      res.setHeader('Content-Type', 'image/png');
      return res.send(cachedTile);
    }

    // If not cached, fetch the tile from OpenStreetMap
    try {
      const response = await axios.get(tileUrl, {
        responseType: 'arraybuffer',
      });
      const tileData = Buffer.from(response.data);

      // Insert the tile into CouchDB cache
      await this.couchDbService.insertTile(tileId, tileData);

      res.setHeader('Content-Type', 'image/png');
      return res.send(tileData);
    } catch (error) {
      return res.status(500).send('Error fetching tile');
    }
  }
}
