import { Controller, Get, Query, Logger } from '@nestjs/common';
import { DispatchService } from 'src/services/dispatchcron/dispatchcron.service';

@Controller('api/dispatch')
export class DispatchController {
  private readonly logger = new Logger(DispatchController.name);

  constructor(private readonly dispatchService: DispatchService) {}

  @Get()
  async getDispatchLogs(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    this.logger.log(
      `Request for dispatch logs from ${startDate} to ${endDate}`,
    );
    const logs = await this.dispatchService.getDispatchLogs(startDate, endDate);
    return logs;
  }
}
