import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IsBoolean } from 'class-validator';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsBoolean()
  active: boolean;
}
