import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateProviderDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  documentType: string;

  @IsNotEmpty()
  @IsString()
  documentNumber: string;
}
