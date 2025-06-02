import { PartialType } from '@nestjs/mapped-types';
import { CreateSparePartMaterialDto } from './create-spare-part-material.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateSparePartMaterialDto extends PartialType(
  CreateSparePartMaterialDto,
) {
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
