import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order } from './entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientModule } from '../client/client.module';
import { VehiculeModule } from '../vehicule/vehicule.module';
import { PricingModule } from '../pricing/pricing.module';
import { SparePartMaterialModule } from '../spare-part-material/spare-part-material.module';
import { ManpowerModule } from '../manpower/manpower.module';
import { OrderStatusModule } from '../order-status/order-status.module';
import { ServiceTypeModule } from '../service-type/service-type.module';
import { OrderManpower } from './entities/order-manpower.entity';
import { OrderSparePartMaterial } from './entities/order-spare-part-material.entity';
import { BillingModule } from '../billing/billing.module';
import { UserModule } from '../user/user.module';
import { DriverModule } from '../driver/driver.module';
import { ProviderModule } from '../provider/provider.module';
import { SupplyModule } from '../supply/supply.module';
import { OrderManpowerSupply } from './entities/order-manpower-supply.entity';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderManpower,
      OrderSparePartMaterial,
      OrderManpowerSupply,
    ]),
    ClientModule,
    VehiculeModule,
    PricingModule,
    SparePartMaterialModule,
    ManpowerModule,
    OrderStatusModule,
    ServiceTypeModule,
    BillingModule,
    UserModule,
    DriverModule,
    ProviderModule,
    SupplyModule,
  ],
  exports: [TypeOrmModule],
})
export class OrderModule {}
