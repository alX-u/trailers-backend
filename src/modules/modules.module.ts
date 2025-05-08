import { Module } from '@nestjs/common';
import { BillingModule } from './billing/billing.module';
import { ClientModule } from './client/client.module';
import { ContactsModule } from './contacts/contacts.module';
import { DocumentTypeModule } from './document-type/document-type.module';
import { DocumentModule } from './document/document.module';
import { DriverModule } from './driver/driver.module';
import { ManpowerModule } from './manpower/manpower.module';
import { OrderStatusModule } from './order-status/order-status.module';
import { OrderModule } from './order/order.module';
import { PricingModule } from './pricing/pricing.module';
import { ProviderModule } from './provider/provider.module';
import { RoleModule } from './role/role.module';
import { ServiceTypeModule } from './service-type/service-type.module';
import { SparePartMaterialModule } from './spare-part-material/spare-part-material.module';
import { UserStatusModule } from './user-status/user-status.module';
import { UserModule } from './user/user.module';
import { VehiculeTypeModule } from './vehicule-type/vehicule-type.module';
import { VehiculeModule } from './vehicule/vehicule.module';

// Import other modules here as needed

@Module({
  imports: [
    BillingModule,
    ClientModule,
    ContactsModule,
    DriverModule,
    DocumentModule,
    DocumentTypeModule,
    ManpowerModule,
    OrderModule,
    OrderStatusModule,
    PricingModule,
    ProviderModule,
    RoleModule,
    ServiceTypeModule,
    SparePartMaterialModule,
    UserModule,
    UserStatusModule,
    VehiculeModule,
    VehiculeTypeModule,
  ],
  exports: [
    BillingModule,
    ClientModule,
    ContactsModule,
    DriverModule,
    DocumentModule,
    DocumentTypeModule,
    ManpowerModule,
    OrderModule,
    OrderStatusModule,
    PricingModule,
    ProviderModule,
    RoleModule,
    ServiceTypeModule,
    SparePartMaterialModule,
    UserModule,
    UserStatusModule,
    VehiculeModule,
    VehiculeTypeModule,
  ],
})
export class ModulesModule {}
