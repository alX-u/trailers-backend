import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateSparePartMaterialDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsNotEmpty()
  measurementUnit: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  providers: string[];
}
