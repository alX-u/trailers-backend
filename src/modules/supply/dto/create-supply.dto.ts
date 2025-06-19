import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsUUID,
} from 'class-validator';

export class CreateSupplyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  measurementUnit?: string;

  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  providers?: string[];
}
