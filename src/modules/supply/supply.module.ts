import { Module } from '@nestjs/common';
import { SupplyService } from './supply.service';
import { SupplyController } from './supply.controller';
import { Supply } from './entities/supply.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProviderModule } from '../provider/provider.module';

@Module({
  controllers: [SupplyController],
  providers: [SupplyService],
  exports: [SupplyService, TypeOrmModule],
  imports: [TypeOrmModule.forFeature([Supply]), ProviderModule],
})
export class SupplyModule {}
