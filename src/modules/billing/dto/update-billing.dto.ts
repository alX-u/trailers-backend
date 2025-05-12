import { PartialType } from '@nestjs/mapped-types';
import { CreateBillingDto } from './create-billing.dto';
import { IsBoolean } from 'class-validator';

export class UpdateBillingDto extends PartialType(CreateBillingDto) {
  @IsBoolean()
  active: boolean;
}
