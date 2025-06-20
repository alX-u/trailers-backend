import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateManpowerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsUUID()
  @IsOptional()
  contractor?: string;
}
