import { IsDate, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  orderNumber: string;

  @IsDate()
  @IsNotEmpty()
  outDate: Date;

  @IsUUID()
  @IsNotEmpty()
  orderStatus: string;

  @IsUUID()
  @IsNotEmpty()
  client: string;

  @IsUUID()
  @IsNotEmpty()
  vehicule: string;

  @IsUUID('all', { each: true })
  @IsNotEmpty()
  pricings: string[];

  @IsUUID('all', { each: true })
  @IsNotEmpty()
  sparePartMaterials: string[];

  @IsUUID('all', { each: true })
  @IsNotEmpty()
  manpowers: string[];
}
