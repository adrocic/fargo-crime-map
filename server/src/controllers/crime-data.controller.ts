import { Controller, Get, Query } from '@nestjs/common';
import { CrimeDataService } from '../services/crime-data.service';
import { CrimeDataProps } from '../modules/crime-data.module';
import { DateQueryDto } from 'src/dtos/date-query.dto';

@Controller('crime-data')
export class CrimeDataController {
  constructor(private readonly crimeDataService: CrimeDataService) {}

  @Get()
  getCrimeData(
    @Query() { startDate, endDate }: DateQueryDto,
  ): Promise<CrimeDataProps[]> {
    return this.crimeDataService.getCrimeData(startDate, endDate);
  }
}
