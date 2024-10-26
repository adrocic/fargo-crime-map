import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ScheduleModule } from '@nestjs/schedule';

import { MaptilesController } from './controllers/maptiles/maptiles.controller';

import { CouchDbService } from './services/couchdb/couchdb.service';
import { DispatchService } from './services/dispatchcron/dispatchcron.service';
import { DispatchController } from './controllers/dispatchlogs/dispatchlogs.controller';
import { MapTilesService } from './services/maptiles/maptiles.service';

@Module({
  controllers: [AppController, MaptilesController, DispatchController],
  providers: [AppService, CouchDbService, DispatchService, MapTilesService],
})
@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [CouchDbService, DispatchService, MapTilesService],
})
export class AppModule {}
