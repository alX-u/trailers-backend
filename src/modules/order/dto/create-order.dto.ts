import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsObject,
  IsString,
  IsUUID,
} from 'class-validator';
import { CreateBillingDto } from 'src/modules/billing/dto/create-billing.dto';
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

  @IsArray()
  @IsNotEmpty()
  serviceTypes: string[];

  @IsUUID()
  @IsNotEmpty()
  client: string;

  @IsUUID()
  @IsNotEmpty()
  vehicule: string;

  @IsArray()
  @IsNotEmpty()
  pricings: CreatePricingDto[];

  @IsArray()
  @IsNotEmpty()
  billings: CreateBillingDto[];

  @IsArray()
  @IsNotEmpty()
  sparePartMaterials: {
    sparePartMaterial: string;
    cantidad: number;
    costoTotal: number;
    factorVenta: number;
    ventaUnitaria: number;
    ventaTotal: number;
  }[];

  @IsArray()
  @IsNotEmpty()
  manpowers: {
    manpower: string;
    cantidad: number;
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
