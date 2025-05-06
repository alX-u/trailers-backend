import { Module } from '@nestjs/common';
import { PricingService } from './pricing.service';
import { PricingController } from './pricing.controller';
import { Pricing } from './entities/pricing.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [PricingController],
  providers: [PricingService],
  imports: [TypeOrmModule.forFeature([Pricing])],
})
export class PricingModule {}
