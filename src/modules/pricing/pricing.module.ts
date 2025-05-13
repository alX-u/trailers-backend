import { Module } from '@nestjs/common';
import { PricingService } from './pricing.service';
import { PricingController } from './pricing.controller';
import { Pricing } from './entities/pricing.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [PricingController],
  providers: [PricingService],
  imports: [TypeOrmModule.forFeature([Pricing]), UserModule],
  exports: [TypeOrmModule, PricingService],
})
export class PricingModule {}
