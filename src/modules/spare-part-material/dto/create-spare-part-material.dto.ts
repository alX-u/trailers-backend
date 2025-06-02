import { IsNotEmpty, IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class CreateSparePartMaterialDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  measurementUnit: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  unitaryCost: number;

  @IsUUID()
  @IsNotEmpty()
  provider: string;
}
