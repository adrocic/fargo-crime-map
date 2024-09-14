// date-query.dto.ts

import { IsDateString, IsString } from 'class-validator';

export class DateQueryDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsString()
  callType: string;
}
