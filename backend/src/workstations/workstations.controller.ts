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
import { WorkstationsService } from './workstations.service';
import { CreateWorkstationDto, UpdateWorkstationDto } from './dto/workstation.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('workstations')
@UseGuards(JwtAuthGuard)
export class WorkstationsController {
  constructor(private workstationsService: WorkstationsService) {}

  @Get()
  list(
    @Request() req: { user: { tailoringShopId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
    @Query('zone') zone?: string,
  ) {
    return this.workstationsService.list(req.user.tailoringShopId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
      zone,
    });
  }

  @Get(':id')
  get(@Request() req: { user: { tailoringShopId: string } }, @Param('id') id: string) {
    return this.workstationsService.get(req.user.tailoringShopId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { tailoringShopId: string } },
    @Body() dto: CreateWorkstationDto,
  ) {
    return this.workstationsService.create(req.user.tailoringShopId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { tailoringShopId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateWorkstationDto,
  ) {
    return this.workstationsService.update(req.user.tailoringShopId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { tailoringShopId: string } }, @Param('id') id: string) {
    return this.workstationsService.remove(req.user.tailoringShopId, id);
  }
}
