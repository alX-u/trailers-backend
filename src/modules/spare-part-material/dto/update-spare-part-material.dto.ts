import { PartialType } from '@nestjs/mapped-types';
import { CreateSparePartMaterialDto } from './create-spare-part-material.dto';

export class UpdateSparePartMaterialDto extends PartialType(
  CreateSparePartMaterialDto,
) {}
