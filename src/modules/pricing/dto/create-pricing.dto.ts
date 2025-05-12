import { IsDate, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreatePricingDto {
  @IsString()
  @IsNotEmpty()
  pricingNumber: string;

  @IsDate()
  @IsNotEmpty()
  pricingDate: Date;

  @IsUUID()
  @IsNotEmpty()
  pricedBy: string;
}
