import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  role: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  userStatus: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  documentType: string;

  @IsNotEmpty()
  @IsString()
  documentNumber: string;
}
