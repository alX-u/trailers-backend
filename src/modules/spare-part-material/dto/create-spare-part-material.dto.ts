import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

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

  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  providers: string[];
}
