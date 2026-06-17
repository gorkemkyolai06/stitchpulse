import { IsEnum, IsOptional, IsString } from 'class-validator';
import { WorkstationStatus, WorkstationSpecialty } from '@prisma/client';

export class CreateWorkstationDto {
  @IsString()
  name: string;

  @IsString()
  zone: string;

  @IsOptional()
  @IsEnum(WorkstationSpecialty)
  specialty?: WorkstationSpecialty;

  @IsOptional()
  @IsString()
  machineModel?: string;

  @IsOptional()
  @IsEnum(WorkstationStatus)
  status?: WorkstationStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateWorkstationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  zone?: string;

  @IsOptional()
  @IsEnum(WorkstationSpecialty)
  specialty?: WorkstationSpecialty;

  @IsOptional()
  @IsString()
  machineModel?: string;

  @IsOptional()
  @IsEnum(WorkstationStatus)
  status?: WorkstationStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
