import { PartialType } from '@nestjs/mapped-types';
import { CreateVehiculeDto } from './create-vehicule.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateVehiculeDto extends PartialType(CreateVehiculeDto) {
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
