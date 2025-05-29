import {
  IsDate,
  IsNotEmpty,
  IsObject,
  IsString,
  IsUUID,
} from 'class-validator';
import { CreateClientDto } from 'src/modules/client/dto/create-client.dto';
import { CreatePricingDto } from 'src/modules/pricing/dto/create-pricing.dto';
import { CreateVehiculeDto } from 'src/modules/vehicule/dto/create-vehicule.dto';

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

  @IsObject()
  @IsNotEmpty()
  client: CreateClientDto;

  @IsObject()
  @IsNotEmpty()
  vehicule: CreateVehiculeDto;

  @IsNotEmpty()
  pricings: CreatePricingDto[];

  @IsUUID('all', { each: true })
  @IsNotEmpty()
  sparePartMaterials: string[];

  @IsUUID('all', { each: true })
  @IsNotEmpty()
  manpowers: string[];
}
