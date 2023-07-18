import { Module } from '@nestjs/common';
import { CrimeDataService } from './crime-data.service';
import { CrimeDataController } from './crime-data.controller';

@Module({
  controllers: [CrimeDataController],
  providers: [CrimeDataService],
})
export class CrimeDataModule {}
