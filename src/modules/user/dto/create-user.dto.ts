import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @IsNotEmpty()
  @IsString()
  last_name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

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
  user_status: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  document_type: string;

  @IsNotEmpty()
  @IsString()
  document_number: string;
}
