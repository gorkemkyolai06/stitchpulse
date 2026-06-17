import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateTailoringShopDto } from './dto/update-tailoring-shop.dto';

@Injectable()
export class TailoringShopService {
  constructor(private prisma: PrismaService) {}

  async get(tailoringShopId: string) {
    const tailoringShop = await this.prisma.tailoringShop.findUnique({
      where: { id: tailoringShopId },
    });
    if (!tailoringShop) throw new NotFoundException('Tenis kulübü bulunamadı');
    return tailoringShop;
  }

  async update(tailoringShopId: string, dto: UpdateTailoringShopDto) {
    await this.get(tailoringShopId);
    return this.prisma.tailoringShop.update({ where: { id: tailoringShopId }, data: dto });
  }
}
