import { IsNotEmpty, IsNumber, IsString, IsUUID, Min } from 'class-validator';

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

  @IsUUID()
  @IsNotEmpty()
  driver: string;
}
