import { IsDateString, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateBillingDto {
  @IsString()
  @IsNotEmpty()
  billingNumber: string;

  @IsDateString()
  @IsNotEmpty()
  billingDate: Date;

  @IsString()
  actNumber: string;

  @IsUUID()
  @IsNotEmpty()
  billedBy: string;
}
