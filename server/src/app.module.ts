import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { MaptilesModule } from './modules/maptiles/maptiles.module';
import { DatabaseModule } from './modules/database/database.module';
import { DispatchService } from './services/dispatchcron/dispatchcron.service';
import { DispatchController } from './controllers/dispatchlogs/dispatchlogs.controller';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    DatabaseModule, // Import the database module first // This imports the MaptilesModule which provides the MapTilesService
    MaptilesModule, // This will now use the CouchDbService from the DatabaseModule
  ],
  controllers: [AppController, DispatchController],
  providers: [
    AppService, // Note: This is also provided in MaptilesModule, which could cause two instances
    DispatchService,
  ],
})
export class AppModule {}
