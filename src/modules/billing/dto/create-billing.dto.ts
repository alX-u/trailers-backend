import { IsDate, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateBillingDto {
  @IsString()
  @IsNotEmpty()
  billingNumber: string;

  @IsDate()
  @IsNotEmpty()
  billingDate: Date;

  @IsUUID()
  @IsNotEmpty()
  billedBy: string;
}
