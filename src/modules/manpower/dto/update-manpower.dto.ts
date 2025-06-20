import { PartialType } from '@nestjs/mapped-types';
import { CreateManpowerDto } from './create-manpower.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateManpowerDto extends PartialType(CreateManpowerDto) {
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
