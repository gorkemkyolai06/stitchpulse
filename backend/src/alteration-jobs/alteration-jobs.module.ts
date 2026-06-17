import { Module } from '@nestjs/common';
import { AlterationJobsController } from './alteration-jobs.controller';
import { AlterationJobsService } from './alteration-jobs.service';

@Module({
  controllers: [AlterationJobsController],
  providers: [AlterationJobsService],
})
export class AlterationJobsModule {}
