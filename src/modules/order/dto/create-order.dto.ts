import {
  IsArray,
  IsDateString,
  IsObject,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { CreateBillingDto } from 'src/modules/billing/dto/create-billing.dto';
import { CreatePricingDto } from 'src/modules/pricing/dto/create-pricing.dto';

export class CreateOrderDto {
  @IsDateString()
  @IsOptional()
  outDate?: Date;

  @IsUUID()
  @IsOptional()
  orderStatus?: string;

  @IsArray()
  @IsOptional()
  serviceTypes?: string[];

  @IsArray()
  @IsOptional()
  assignTo?: string[];

  @IsUUID()
  @IsOptional()
  client?: string;

  @IsUUID()
  @IsOptional()
  vehicule?: string;

  @IsUUID()
  @IsOptional()
  assignedDriver?: string;

  @IsArray()
  @IsOptional()
  pricings?: CreatePricingDto[];

  @IsArray()
  @IsOptional()
  billings?: CreateBillingDto[];

  @IsArray()
  @IsOptional()
  sparePartMaterials?: {
    sparePartMaterial: string;
    selectedProvider: string;
    unitaryCost?: number;
    cantidad: number;
    costoTotal: number;
    factorVenta: number;
    ventaUnitaria: number;
    ventaTotal: number;
  }[];

  @IsArray()
  @IsOptional()
  manpowers?: {
    manpower: string;
    supplies?: {
      supply: string;
      unitaryCost?: number;
      cantidad: number;
      costoTotal: number;
      factorVenta: number;
      ventaUnitaria: number;
      ventaTotal: number;
    }[];
    unitaryCost?: number;
    useDetail: string;
    cantidad: number;
    costoTotal: number;
    factorVenta: number;
    ventaUnitaria: number;
    ventaTotal: number;
  }[];

  @IsObject()
  @IsOptional()
  totals?: {
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
