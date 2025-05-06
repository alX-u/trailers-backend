import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvConfiguration } from './config/env.config';
import { getTypeOrmConfig } from './config/type-orm.config';
import { JoiValidationSchema } from './config/joi.validation.config';
import { UserModule } from './modules/user/user.module';
import { DocumentTypeModule } from './modules/document-type/document-type.module';
import { RoleModule } from './modules/role/role.module';
import { UserStatusModule } from './modules/user-status/user-status.module';
import { OrderStatusModule } from './modules/order-status/order-status.module';
import { ServiceTypeModule } from './modules/service-type/service-type.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { VehiculeTypeModule } from './modules/vehicule-type/vehicule-type.module';
import { VehiculeModule } from './modules/vehicule/vehicule.module';
import { DocumentModule } from './modules/document/document.module';
import { DriverModule } from './modules/driver/driver.module';
import { OrderModule } from './modules/order/order.module';
import { ClientModule } from './modules/client/client.module';
import { BillingModule } from './modules/billing/billing.module';
import { PricingModule } from './modules/pricing/pricing.module';
import { SparePartMaterialModule } from './modules/spare-part-material/spare-part-material.module';
import { ProviderModule } from './modules/provider/provider.module';
import { ManpowerModule } from './modules/manpower/manpower.module';
import { ContractorModule } from './modules/contractor/contractor.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'dev'}`,
      load: [EnvConfiguration],
      validationSchema: JoiValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getTypeOrmConfig,
    }),
    UserModule,
    DocumentTypeModule,
    RoleModule,
    UserStatusModule,
    OrderStatusModule,
    ServiceTypeModule,
    ContactsModule,
    VehiculeTypeModule,
    VehiculeModule,
    DocumentModule,
    DriverModule,
    OrderModule,
    ClientModule,
    BillingModule,
    PricingModule,
    SparePartMaterialModule,
    ProviderModule,
    ManpowerModule,
    ContractorModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
