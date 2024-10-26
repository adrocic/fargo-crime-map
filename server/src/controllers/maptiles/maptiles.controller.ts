// src/controllers/maptiles/maptiles.controller.ts

import {
  Controller,
  Get,
  Logger,
  Param,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { MapTilesService } from 'src/services/maptiles/maptiles.service';

@Controller('maptiles')
export class MaptilesController {
  private readonly logger = new Logger(MaptilesController.name);

  constructor(private readonly mapTilesService: MapTilesService) {}

  @Get('/tile/:z/:x/:y.png')
  async getTile(
    @Param('z') z: number,
    @Param('x') x: number,
    @Param('y') y: number,
    @Res() res: Response,
  ) {
    try {
      const tileData = await this.mapTilesService.getTile(z, x, y);
      res.setHeader('Content-Type', 'image/png');
      return res.send(tileData);
    } catch (error) {
      this.logger.error(`Error in getTile controller:`, error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Error fetching tile');
    }
  }
}
