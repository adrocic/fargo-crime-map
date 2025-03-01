// src/controllers/maptiles/maptiles.controller.ts

import { Controller, Get, Param, Res, Logger } from '@nestjs/common';
import { MapTilesService } from '../../services/maptiles/maptiles.service';
import { Response } from 'express';
import { ApiTags, ApiParam, ApiResponse } from '@nestjs/swagger';

@ApiTags('Map Tiles')
@Controller('maptiles')
export class MaptilesController {
  private readonly logger = new Logger(MaptilesController.name);

  constructor(private readonly mapTilesService: MapTilesService) {}

  @Get('tile/:z/:x/:y.png')
  @ApiParam({ name: 'z', description: 'Zoom level' })
  @ApiParam({ name: 'x', description: 'X coordinate' })
  @ApiParam({ name: 'y', description: 'Y coordinate' })
  @ApiResponse({ status: 200, description: 'Returns a map tile image' })
  async getTile(
    @Param('z') z: string,
    @Param('x') x: string,
    @Param('y') y: string,
    @Res() res: Response,
  ) {
    try {
      this.logger.debug(`Fetching tile z=${z}, x=${x}, y=${y}`);
      const tile = await this.mapTilesService.getTile(
        parseInt(z, 10),
        parseInt(x, 10),
        parseInt(y, 10),
      );

      // Set appropriate headers for PNG image
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day

      return res.send(tile);
    } catch (error) {
      this.logger.error(`Error fetching tile: ${error.message}`);
      return res.status(404).send('Tile not found');
    }
  }
}
