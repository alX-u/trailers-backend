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

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [
    TypeOrmModule.forFeature([Order]),
    ClientModule,
    VehiculeModule,
    PricingModule,
    SparePartMaterialModule,
    ManpowerModule,
    OrderStatusModule,
    ServiceTypeModule,
  ],
  exports: [TypeOrmModule],
})
export class OrderModule {}
