import { IsNotEmpty, IsString } from 'class-validator';

export class CreateManpowerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string;
}
