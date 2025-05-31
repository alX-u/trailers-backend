import {
  IsDateString,
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

  @IsDateString()
  @IsNotEmpty()
  outDate: Date;

  @IsUUID()
  @IsNotEmpty()
  orderStatus: string;

  @IsUUID('all', { each: true })
  @IsNotEmpty()
  serviceTypes: string[];

  @IsObject()
  @IsNotEmpty()
  client: CreateClientDto;

  @IsObject()
  @IsNotEmpty()
  vehicule: CreateVehiculeDto;

  @IsNotEmpty()
  pricings: CreatePricingDto[];

  @IsObject()
  @IsNotEmpty()
  sparePartMaterials: {
    sparePartMaterial: string;
    costoTotal: number;
    factorVenta: number;
    ventaUnitaria: number;
    ventaTotal: number;
  }[];

  @IsObject()
  @IsNotEmpty()
  manpowers: {
    manpower: string;
    costoTotal: number;
    factorVenta: number;
    ventaUnitaria: number;
    ventaTotal: number;
  }[];

  @IsObject()
  @IsNotEmpty()
  totals: {
    subtotalCostosRepuestos: number;
    subtotalVentasRepuestos: number;
    subtotalCostosManoObra: number;
    subtotalVentasManoObra: number;
    subtotalCostos: number;
    subtotalVentas: number;
    iva: number;
    totalVenta: number;
  };
}
