import { Module } from '@nestjs/common';
import { TailoringShopController } from './tailoring-shop.controller';
import { TailoringShopService } from './tailoring-shop.service';

@Module({
  controllers: [TailoringShopController],
  providers: [TailoringShopService],
})
export class TailoringShopModule {}
