import { PartialType } from '@nestjs/mapped-types';
import { CreateManpowerDto } from './create-manpower.dto';
import { IsBoolean } from 'class-validator';

export class UpdateManpowerDto extends PartialType(CreateManpowerDto) {
  @IsBoolean()
  active: boolean;
}
