import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateManpowerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsNumber()
  @IsNotEmpty()
  unitaryCost: number;

  @IsUUID()
  @IsNotEmpty()
  contractor: string;
}
