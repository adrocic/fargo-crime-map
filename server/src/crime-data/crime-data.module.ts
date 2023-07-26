import { Module } from '@nestjs/common';
import { CrimeDataService } from './crime-data.service';
import { CrimeDataController } from './crime-data.controller';
import { ApiProperty } from '@nestjs/swagger';

export class CrimeDataProps {
  @ApiProperty()
  dateAndTime: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  callType: string;

  @ApiProperty()
  description: string;
}

@Module({
  controllers: [CrimeDataController],
  providers: [CrimeDataService],
})
export class CrimeDataModule {}
