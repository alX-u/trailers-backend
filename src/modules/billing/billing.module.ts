import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Billing } from './entities/billing.entity';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [BillingController],
  providers: [BillingService],
  imports: [TypeOrmModule.forFeature([Billing]), UserModule],
  exports: [TypeOrmModule, BillingService],
})
export class BillingModule {}
