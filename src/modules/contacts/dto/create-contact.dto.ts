import { IsBoolean, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateContactDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  email: string;

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  client: string;

  @IsBoolean()
  isPrincipalContact: boolean;
}
