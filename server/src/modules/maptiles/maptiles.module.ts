import { Module } from '@nestjs/common';
import { MaptilesController } from '../../controllers/maptiles/maptiles.controller';
import { MapTilesService } from '../../services/maptiles/maptiles.service';

@Module({
  controllers: [MaptilesController],
  providers: [MapTilesService], // CouchDbService is now provided by DatabaseModule
  exports: [MapTilesService],
})
export class MaptilesModule {}
