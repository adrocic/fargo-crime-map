import { Controller, Get } from '@nestjs/common';
import { CrimeDataService } from './crime-data.service';
import { CrimeDataProps } from './crime-data.module';

@Controller('crime-data')
export class CrimeDataController {
  constructor(private readonly crimeDataService: CrimeDataService) {}

  @Get()
  getCrimeData(): Promise<CrimeDataProps[]> {
    return this.crimeDataService.getCrimeData();
  }
}
