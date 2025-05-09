import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSparePartMaterialDto {
  @IsNotEmpty()
  @IsString()
  sparePartMaterialName: string;
}
