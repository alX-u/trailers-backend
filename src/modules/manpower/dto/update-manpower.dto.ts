import { PartialType } from '@nestjs/mapped-types';
import { CreateManpowerDto } from './create-manpower.dto';

export class UpdateManpowerDto extends PartialType(CreateManpowerDto) {}
