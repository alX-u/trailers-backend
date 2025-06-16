import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateVehiculeDto {
  @IsString()
  @IsNotEmpty()
  placaCabezote: string;

  @IsString()
  @IsNotEmpty()
  placaTrailer: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  kmsSalida: number;

  @IsUUID()
  @IsNotEmpty()
  vehiculeType: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  drivers: string[];
}
