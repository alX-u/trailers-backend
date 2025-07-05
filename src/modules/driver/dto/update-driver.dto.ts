import { PartialType } from '@nestjs/mapped-types';
import { CreateDriverDto } from './create-driver.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateDriverDto extends PartialType(CreateDriverDto) {
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
