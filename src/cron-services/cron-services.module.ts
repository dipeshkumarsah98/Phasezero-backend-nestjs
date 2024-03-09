import { Module } from '@nestjs/common';
import { CronServicesService } from './cron-services.service';

@Module({
  providers: [CronServicesService],
})
export class CronServicesModule {}
