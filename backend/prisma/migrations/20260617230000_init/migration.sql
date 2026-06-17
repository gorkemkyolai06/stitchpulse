-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('owner', 'manager', 'tailor');

-- CreateEnum
CREATE TYPE "WorkstationSpecialty" AS ENUM ('formal', 'bridal', 'casual', 'leather', 'denim', 'specialty');

-- CreateEnum
CREATE TYPE "WorkstationStatus" AS ENUM ('available', 'in_use', 'cleaning', 'maintenance', 'closed');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('recorded', 'verified', 'disputed');

-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('hem', 'suit', 'wedding_dress', 'leather', 'denim', 'rush');

-- CreateEnum
CREATE TYPE "EquipmentPriority" AS ENUM ('low', 'medium', 'high', 'urgent');

-- CreateEnum
CREATE TYPE "EquipmentStatus" AS ENUM ('open', 'in_progress', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "ChecklistCategory" AS ENUM ('final_press', 'stitch_inspection', 'fitting_prep', 'button_check', 'lining_review', 'other');

-- CreateEnum
CREATE TYPE "ChecklistStatus" AS ENUM ('scheduled', 'in_progress', 'completed', 'overdue');

-- CreateEnum
CREATE TYPE "ServiceCategory" AS ENUM ('basic_alteration', 'bridal_package', 'rush_service', 'leather_work', 'custom_fitting', 'other');

-- CreateEnum
CREATE TYPE "ServiceRateStatus" AS ENUM ('active', 'upcoming', 'archived');

-- CreateEnum
CREATE TYPE "FabricOrderStatus" AS ENUM ('pending', 'in_progress', 'completed', 'delivered');

-- CreateTable
CREATE TABLE "tailoring_shops" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip_code" TEXT,
    "total_workstations" INTEGER NOT NULL DEFAULT 6,
    "timezone" TEXT NOT NULL DEFAULT 'America/Chicago',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tailoring_shops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'owner',
    "tailoring_shop_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workstations" (
    "id" TEXT NOT NULL,
    "tailoring_shop_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "zone" TEXT NOT NULL,
    "specialty" "WorkstationSpecialty" NOT NULL DEFAULT 'formal',
    "machine_model" TEXT,
    "status" "WorkstationStatus" NOT NULL DEFAULT 'available',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workstations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alteration_jobs" (
    "id" TEXT NOT NULL,
    "tailoring_shop_id" TEXT NOT NULL,
    "workstation_id" TEXT NOT NULL,
    "due_at" TIMESTAMP(3) NOT NULL,
    "job_type" "JobType" NOT NULL DEFAULT 'hem',
    "cash_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "card_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "item_count" INTEGER NOT NULL DEFAULT 1,
    "rush_fee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "JobStatus" NOT NULL DEFAULT 'recorded',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "alteration_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipment_maintenance" (
    "id" TEXT NOT NULL,
    "tailoring_shop_id" TEXT NOT NULL,
    "workstation_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "reported_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),
    "priority" "EquipmentPriority" NOT NULL DEFAULT 'medium',
    "status" "EquipmentStatus" NOT NULL DEFAULT 'open',
    "cost" DOUBLE PRECISION,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "equipment_maintenance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quality_checklists" (
    "id" TEXT NOT NULL,
    "tailoring_shop_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" "ChecklistCategory" NOT NULL DEFAULT 'other',
    "zone" TEXT,
    "scheduled_at" TIMESTAMP(3) NOT NULL,
    "status" "ChecklistStatus" NOT NULL DEFAULT 'scheduled',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quality_checklists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_rates" (
    "id" TEXT NOT NULL,
    "tailoring_shop_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "rate_category" "ServiceCategory" NOT NULL DEFAULT 'basic_alteration',
    "status" "ServiceRateStatus" NOT NULL DEFAULT 'active',
    "base_price" DOUBLE PRECISION NOT NULL,
    "price_multiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fabric_orders" (
    "id" TEXT NOT NULL,
    "tailoring_shop_id" TEXT NOT NULL,
    "customer_name" TEXT NOT NULL,
    "fabric_type" TEXT NOT NULL,
    "supplier_name" TEXT,
    "status" "FabricOrderStatus" NOT NULL DEFAULT 'pending',
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fabric_orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "workstations_tailoring_shop_id_status_idx" ON "workstations"("tailoring_shop_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "workstations_tailoring_shop_id_name_key" ON "workstations"("tailoring_shop_id", "name");

-- CreateIndex
CREATE INDEX "alteration_jobs_tailoring_shop_id_due_at_idx" ON "alteration_jobs"("tailoring_shop_id", "due_at");

-- CreateIndex
CREATE INDEX "alteration_jobs_tailoring_shop_id_status_idx" ON "alteration_jobs"("tailoring_shop_id", "status");

-- CreateIndex
CREATE INDEX "equipment_maintenance_tailoring_shop_id_status_idx" ON "equipment_maintenance"("tailoring_shop_id", "status");

-- CreateIndex
CREATE INDEX "equipment_maintenance_tailoring_shop_id_priority_idx" ON "equipment_maintenance"("tailoring_shop_id", "priority");

-- CreateIndex
CREATE INDEX "quality_checklists_tailoring_shop_id_scheduled_at_idx" ON "quality_checklists"("tailoring_shop_id", "scheduled_at");

-- CreateIndex
CREATE INDEX "service_rates_tailoring_shop_id_rate_category_idx" ON "service_rates"("tailoring_shop_id", "rate_category");

-- CreateIndex
CREATE INDEX "fabric_orders_tailoring_shop_id_status_idx" ON "fabric_orders"("tailoring_shop_id", "status");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_tailoring_shop_id_fkey" FOREIGN KEY ("tailoring_shop_id") REFERENCES "tailoring_shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workstations" ADD CONSTRAINT "workstations_tailoring_shop_id_fkey" FOREIGN KEY ("tailoring_shop_id") REFERENCES "tailoring_shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alteration_jobs" ADD CONSTRAINT "alteration_jobs_tailoring_shop_id_fkey" FOREIGN KEY ("tailoring_shop_id") REFERENCES "tailoring_shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alteration_jobs" ADD CONSTRAINT "alteration_jobs_workstation_id_fkey" FOREIGN KEY ("workstation_id") REFERENCES "workstations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment_maintenance" ADD CONSTRAINT "equipment_maintenance_tailoring_shop_id_fkey" FOREIGN KEY ("tailoring_shop_id") REFERENCES "tailoring_shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment_maintenance" ADD CONSTRAINT "equipment_maintenance_workstation_id_fkey" FOREIGN KEY ("workstation_id") REFERENCES "workstations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quality_checklists" ADD CONSTRAINT "quality_checklists_tailoring_shop_id_fkey" FOREIGN KEY ("tailoring_shop_id") REFERENCES "tailoring_shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_rates" ADD CONSTRAINT "service_rates_tailoring_shop_id_fkey" FOREIGN KEY ("tailoring_shop_id") REFERENCES "tailoring_shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fabric_orders" ADD CONSTRAINT "fabric_orders_tailoring_shop_id_fkey" FOREIGN KEY ("tailoring_shop_id") REFERENCES "tailoring_shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

