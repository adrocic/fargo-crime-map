import {
  Controller,
  Get,
  Query,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { DispatchService } from '../../services/dispatchcron/dispatchcron.service';
import { ApiTags, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { parseISO, isValid } from 'date-fns';

@ApiTags('Dispatch Log Info')
@Controller('api/dispatch')
export class DispatchController {
  private readonly logger = new Logger(DispatchController.name);

  constructor(private readonly dispatchService: DispatchService) {}

  @Get()
  @ApiQuery({
    name: 'startDate',
    required: true,
    description: 'Start date in YYYY-MM-DD format',
  })
  @ApiQuery({
    name: 'endDate',
    required: true,
    description: 'End date in YYYY-MM-DD format',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns dispatch logs for the specified date range',
  })
  async getDispatchLogs(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    try {
      this.logger.log(`Fetching dispatch logs from ${startDate} to ${endDate}`);

      // Validate date formats
      if (!startDate || !endDate) {
        throw new HttpException(
          'startDate and endDate query parameters are required',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Ensure dates are in ISO format (YYYY-MM-DD)
      const startDateISO = this.ensureISODateFormat(startDate);
      const endDateISO = this.ensureISODateFormat(endDate);

      // Delegate to service
      const data = await this.dispatchService.getDispatchLogs(
        startDateISO,
        endDateISO,
      );
      return data;
    } catch (error) {
      this.logger.error(
        `Error in getDispatchLogs: ${error.message}`,
        error.stack,
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `Failed to fetch dispatch logs: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Ensures a date string is in ISO format (YYYY-MM-DD)
   * Converts from M/D/YYYY format if needed
   */
  private ensureISODateFormat(dateStr: string): string {
    // If it's already in ISO format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr;
    }

    // Try to parse as M/D/YYYY format
    const dateParts = dateStr.split('/');
    if (dateParts.length === 3) {
      const month = dateParts[0].padStart(2, '0');
      const day = dateParts[1].padStart(2, '0');
      const year = dateParts[2];
      const isoDate = `${year}-${month}-${day}`;

      // Validate the converted date
      if (isValid(parseISO(isoDate))) {
        return isoDate;
      }
    }

    // If all else fails, throw an error
    throw new HttpException(
      `Invalid date format: ${dateStr}. Expected format is YYYY-MM-DD or M/D/YYYY.`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
