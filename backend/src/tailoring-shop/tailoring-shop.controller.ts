import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { TailoringShopService } from './tailoring-shop.service';
import { UpdateTailoringShopDto } from './dto/update-tailoring-shop.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tailoring-shop')
@UseGuards(JwtAuthGuard)
export class TailoringShopController {
  constructor(private tailoringShopService: TailoringShopService) {}

  @Get()
  get(@Request() req: { user: { tailoringShopId: string } }) {
    return this.tailoringShopService.get(req.user.tailoringShopId);
  }

  @Patch()
  update(
    @Request() req: { user: { tailoringShopId: string } },
    @Body() dto: UpdateTailoringShopDto,
  ) {
    return this.tailoringShopService.update(req.user.tailoringShopId, dto);
  }
}
