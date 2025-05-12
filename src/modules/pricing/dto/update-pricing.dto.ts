import { PartialType } from '@nestjs/mapped-types';
import { CreatePricingDto } from './create-pricing.dto';
import { IsBoolean } from 'class-validator';

export class UpdatePricingDto extends PartialType(CreatePricingDto) {
  @IsBoolean()
  active: boolean;
}
