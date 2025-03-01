import { IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DispatchQueryDto {
  @ApiProperty({ description: 'Start date in YYYY-MM-DD format' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'End date in YYYY-MM-DD format' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ description: 'Crime type filter', required: false })
  @IsOptional()
  type?: string;
}
