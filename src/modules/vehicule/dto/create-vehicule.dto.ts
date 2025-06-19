import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
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
  @IsOptional()
  @Min(0)
  kmsSalida?: number;

  @IsUUID()
  @IsNotEmpty()
  vehiculeType: string;
}
