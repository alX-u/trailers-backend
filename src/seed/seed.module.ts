import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { DocumentTypeModule } from 'src/modules/document-type/document-type.module';
import { RoleModule } from 'src/modules/role/role.module';
import { UserStatusModule } from 'src/modules/user-status/user-status.module';
import { ServiceTypeModule } from 'src/modules/service-type/service-type.module';
import { OrderStatusModule } from 'src/modules/order-status/order-status.module';
import { VehiculeTypeModule } from 'src/modules/vehicule-type/vehicule-type.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    DocumentTypeModule,
    RoleModule,
    UserStatusModule,
    ServiceTypeModule,
    OrderStatusModule,
    VehiculeTypeModule,
  ],
})
export class SeedModule {}
