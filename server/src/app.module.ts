import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ScheduleModule } from '@nestjs/schedule';

import { MaptilesController } from './controllers/maptiles/maptiles.controller';

import { CouchDbService } from './services/couchdb/couchdb.service';
import { DispatchService } from './services/dispatchcron/dispatchcron.service';
import { DispatchController } from './controllers/dispatchlogs/dispatchlogs.controller';

@Module({
  controllers: [AppController, MaptilesController, DispatchController],
  providers: [AppService, CouchDbService, DispatchService],
})
@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [CouchDbService, DispatchService],
})
export class AppModule {}
