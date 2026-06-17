import { Module } from '@nestjs/common';
import { WorkstationsController } from './workstations.controller';
import { WorkstationsService } from './workstations.service';

@Module({
  controllers: [WorkstationsController],
  providers: [WorkstationsService],
})
export class WorkstationsModule {}
