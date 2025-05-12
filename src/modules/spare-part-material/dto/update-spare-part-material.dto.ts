import { PartialType } from '@nestjs/mapped-types';
import { CreateSparePartMaterialDto } from './create-spare-part-material.dto';
import { IsBoolean } from 'class-validator';

export class UpdateSparePartMaterialDto extends PartialType(
  CreateSparePartMaterialDto,
) {
  @IsBoolean()
  active: boolean;
}
