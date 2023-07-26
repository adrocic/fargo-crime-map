import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CrimeDataController } from './controllers/crime-data.controller';
import { CrimeDataModule } from './modules/crime-data.module';
import { CrimeDataService } from './services/crime-data.service';

@Module({
  imports: [CrimeDataModule],
  controllers: [AppController, CrimeDataController],
  providers: [AppService, CrimeDataService],
})
export class AppModule {}
