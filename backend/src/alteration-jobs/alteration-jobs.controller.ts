import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import { AlterationJobsService } from './alteration-jobs.service';
import { CreateAlterationJobDto, UpdateAlterationJobDto } from './dto/alteration-job.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('alteration-jobs')
@UseGuards(JwtAuthGuard)
export class AlterationJobsController {
  constructor(private alterationJobsService: AlterationJobsService) {}

  @Get()
  list(
    @Request() req: { user: { tailoringShopId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
  ) {
    return this.alterationJobsService.list(req.user.tailoringShopId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
    });
  }

  @Get(':id')
  get(@Request() req: { user: { tailoringShopId: string } }, @Param('id') id: string) {
    return this.alterationJobsService.get(req.user.tailoringShopId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { tailoringShopId: string } },
    @Body() dto: CreateAlterationJobDto,
  ) {
    return this.alterationJobsService.create(req.user.tailoringShopId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { tailoringShopId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateAlterationJobDto,
  ) {
    return this.alterationJobsService.update(req.user.tailoringShopId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { tailoringShopId: string } }, @Param('id') id: string) {
    return this.alterationJobsService.remove(req.user.tailoringShopId, id);
  }
}
