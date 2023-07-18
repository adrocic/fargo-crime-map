import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CrimeDataController } from './crime-data/crime-data.controller';
import { CrimeDataModule } from './crime-data/crime-data.module';
import { CrimeDataService } from './crime-data/crime-data.service';

@Module({
  imports: [CrimeDataModule],
  controllers: [AppController, CrimeDataController],
  providers: [AppService, CrimeDataService],
})
export class AppModule {}
