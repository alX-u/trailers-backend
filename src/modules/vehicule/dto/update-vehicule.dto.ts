import { PartialType } from '@nestjs/mapped-types';
import { CreateVehiculeDto } from './create-vehicule.dto';
import { IsBoolean } from 'class-validator';

export class UpdateVehiculeDto extends PartialType(CreateVehiculeDto) {
  @IsBoolean()
  active: boolean;
}
