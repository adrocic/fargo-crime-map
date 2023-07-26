// date-query.dto.ts

import { IsDateString, IsOptional } from 'class-validator';

export class DateQueryDto {
  @IsDateString()
  @IsOptional()
  startDate: string;

  @IsDateString()
  @IsOptional()
  endDate: string;
}
