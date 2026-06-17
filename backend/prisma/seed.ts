import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const SHOP_ID = '00000000-0000-0000-0000-000000000001';

async function main() {
  const passwordHash = await bcrypt.hash('demo123456', 12);

  await prisma.tailoringShop.upsert({
    where: { id: SHOP_ID },
    update: {},
    create: {
      id: SHOP_ID,
      name: 'Heritage Tailors & Alterations',
      phone: '+13125550142',
      address: '142 Michigan Avenue',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      totalWorkstations: 6,
      timezone: 'America/Chicago',
      users: {
        create: {
          email: 'demo@heritagetailors.com',
          passwordHash,
          firstName: 'Elif',
          lastName: 'Kara',
          role: 'owner',
        },
      },
    },
  });

  const workstationData = [
    {
      id: '00000000-0000-0000-0000-000000000101',
      name: 'Station A — Formal',
      zone: 'Front Atelier',
      specialty: 'formal' as const,
      machineModel: 'Juki DDL-8700',
      status: 'available' as const,
    },
    {
      id: '00000000-0000-0000-0000-000000000102',
      name: 'Station B — Bridal',
      zone: 'Front Atelier',
      specialty: 'bridal' as const,
      machineModel: 'Brother PQ1500SL',
      status: 'in_use' as const,
    },
    {
      id: '00000000-0000-0000-0000-000000000103',
      name: 'Station C — Casual',
      zone: 'Back Workshop',
      specialty: 'casual' as const,
      machineModel: 'Singer 4423',
      status: 'available' as const,
    },
    {
      id: '00000000-0000-0000-0000-000000000104',
      name: 'Station D — Leather',
      zone: 'Back Workshop',
      specialty: 'leather' as const,
      machineModel: 'Consew 206RB-5',
      status: 'cleaning' as const,
    },
    {
      id: '00000000-0000-0000-0000-000000000105',
      name: 'Press & Finish',
      zone: 'Finishing Room',
      specialty: 'specialty' as const,
      machineModel: 'Naomoto HYS-700',
      status: 'maintenance' as const,
    },
    {
      id: '00000000-0000-0000-0000-000000000106',
      name: 'Fitting Room Suite',
      zone: 'Client Area',
      specialty: 'formal' as const,
      machineModel: null,
      status: 'closed' as const,
    },
  ];

  const workstations = [];
  for (const ws of workstationData) {
    const created = await prisma.workstation.upsert({
      where: { id: ws.id },
      update: {},
      create: { ...ws, tailoringShopId: SHOP_ID },
    });
    workstations.push(created);
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  await prisma.alterationJob.upsert({
    where: { id: '00000000-0000-0000-0000-000000000201' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000201',
      tailoringShopId: SHOP_ID,
      workstationId: workstations[2].id,
      dueAt: yesterday,
      jobType: 'suit',
      cashAmount: 0,
      cardAmount: 285.0,
      itemCount: 2,
      rushFee: 45.0,
      status: 'verified',
      notes: 'Erkek takım elbise paça kısaltma',
    },
  });

  await prisma.alterationJob.upsert({
    where: { id: '00000000-0000-0000-0000-000000000202' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000202',
      tailoringShopId: SHOP_ID,
      workstationId: workstations[1].id,
      dueAt: yesterday,
      jobType: 'wedding_dress',
      cashAmount: 120.0,
      cardAmount: 680.0,
      itemCount: 1,
      rushFee: 95.0,
      status: 'verified',
      notes: 'Gelinlik bel ve kol düzeltme',
    },
  });

  const reportedAt = new Date();
  reportedAt.setDate(reportedAt.getDate() - 2);

  await prisma.equipmentMaintenance.upsert({
    where: { id: '00000000-0000-0000-0000-000000000301' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000301',
      tailoringShopId: SHOP_ID,
      workstationId: workstations[4].id,
      title: 'Buharlı pres makinesi arızası',
      description: 'Basınç düzensiz, buhar kaçağı tespit edildi',
      reportedAt,
      priority: 'urgent',
      status: 'open',
      cost: null,
    },
  });

  await prisma.equipmentMaintenance.upsert({
    where: { id: '00000000-0000-0000-0000-000000000302' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000302',
      tailoringShopId: SHOP_ID,
      workstationId: workstations[1].id,
      title: 'Dikiş makinesi iğne değişimi',
      description: 'Brother PQ1500SL iğne kırılması',
      reportedAt,
      priority: 'medium',
      status: 'in_progress',
      cost: 35.0,
    },
  });

  const scheduledAt = new Date();
  scheduledAt.setDate(scheduledAt.getDate() + 1);

  await prisma.qualityChecklist.upsert({
    where: { id: '00000000-0000-0000-0000-000000000401' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000401',
      tailoringShopId: SHOP_ID,
      title: 'Gelinlik son kontrol — Thompson',
      category: 'stitch_inspection',
      zone: 'Front Atelier',
      scheduledAt,
      status: 'scheduled',
    },
  });

  await prisma.qualityChecklist.upsert({
    where: { id: '00000000-0000-0000-0000-000000000402' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000402',
      tailoringShopId: SHOP_ID,
      title: 'Takım elbise final pres — Martinez',
      category: 'final_press',
      zone: 'Finishing Room',
      scheduledAt,
      status: 'scheduled',
    },
  });

  await prisma.serviceRate.upsert({
    where: { id: '00000000-0000-0000-0000-000000000501' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000501',
      tailoringShopId: SHOP_ID,
      title: 'Paça Kısaltma',
      rateCategory: 'basic_alteration',
      basePrice: 18.0,
      priceMultiplier: 1.0,
      status: 'active',
    },
  });

  await prisma.serviceRate.upsert({
    where: { id: '00000000-0000-0000-0000-000000000502' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000502',
      tailoringShopId: SHOP_ID,
      title: 'Gelinlik Paketi',
      rateCategory: 'bridal_package',
      basePrice: 450.0,
      priceMultiplier: 1.25,
      status: 'active',
    },
  });

  await prisma.fabricOrder.upsert({
    where: { id: '00000000-0000-0000-0000-000000000601' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000601',
      tailoringShopId: SHOP_ID,
      customerName: 'Thompson Wedding',
      fabricType: 'İpek Saten',
      supplierName: 'Fabricut Chicago',
      price: 320.0,
      status: 'pending',
    },
  });

  await prisma.fabricOrder.upsert({
    where: { id: '00000000-0000-0000-0000-000000000602' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000602',
      tailoringShopId: SHOP_ID,
      customerName: 'Martinez Corporate',
      fabricType: 'Yün Gabardin',
      supplierName: 'Holly Hunt Textiles',
      price: 185.0,
      status: 'in_progress',
    },
  });

  console.log('Seed completed: Heritage Tailors & Alterations');
  console.log('Demo: demo@heritagetailors.com / demo123456');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
