import { Module } from '@nestjs/common';
import { CrimeDataService } from '../services/crime-data.service';
import { CrimeDataController } from '../controllers/crime-data.controller';
import { ApiProperty } from '@nestjs/swagger';

export class CrimeDataProps {
  @ApiProperty()
  DateString: string;

  @ApiProperty()
  Address: string;

  @ApiProperty()
  CallType: string;

  @ApiProperty()
  NatureOfCall: string;

  @ApiProperty()
  IncidentNumber: string;
}

@Module({
  controllers: [CrimeDataController],
  providers: [CrimeDataService],
})
export class CrimeDataModule {}
