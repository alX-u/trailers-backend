import { IsDateString, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreatePricingDto {
  @IsString()
  @IsNotEmpty()
  pricingNumber: string;

  @IsDateString()
  @IsNotEmpty()
  pricingDate: Date;

  @IsUUID()
  @IsNotEmpty()
  pricedBy: string;
}
