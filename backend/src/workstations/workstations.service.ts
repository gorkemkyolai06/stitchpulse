import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkstationDto, UpdateWorkstationDto } from './dto/workstation.dto';

@Injectable()
export class WorkstationsService {
  constructor(private prisma: PrismaService) {}

  async list(tailoringShopId: string, params: { page?: number; status?: string; zone?: string }) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { tailoringShopId };
    if (params.status) where.status = params.status;
    if (params.zone) where.zone = params.zone;

    const [data, total] = await Promise.all([
      this.prisma.workstation.findMany({
        where,
        orderBy: [{ zone: 'asc' }, { name: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
        include: {
          equipmentMaintenance: {
            where: { status: { in: ['open', 'in_progress'] } },
            take: 1,
            orderBy: { reportedAt: 'desc' },
          },
        },
      }),
      this.prisma.workstation.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async get(tailoringShopId: string, id: string) {
    const court = await this.prisma.workstation.findFirst({
      where: { id, tailoringShopId },
      include: {
        equipmentMaintenance: { orderBy: { reportedAt: 'desc' }, take: 5 },
        alterationJobs: { orderBy: { dueAt: 'desc' }, take: 5 },
      },
    });
    if (!court) throw new NotFoundException('İstasyon bulunamadı');
    return court;
  }

  async create(tailoringShopId: string, dto: CreateWorkstationDto) {
    return this.prisma.workstation.create({ data: { ...dto, tailoringShopId } });
  }

  async update(tailoringShopId: string, id: string, dto: UpdateWorkstationDto) {
    await this.get(tailoringShopId, id);
    return this.prisma.workstation.update({ where: { id }, data: dto });
  }

  async remove(tailoringShopId: string, id: string) {
    await this.get(tailoringShopId, id);
    return this.prisma.workstation.delete({ where: { id } });
  }
}
