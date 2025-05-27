import { Module } from '@nestjs/common';
import { OrderStatus } from './entities/order-status.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderStatusController } from './order-status.controller';
import { OrderStatusService } from './order-status.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderStatus])],
  exports: [TypeOrmModule],
  controllers: [OrderStatusController],
  providers: [OrderStatusService],
})
export class OrderStatusModule {}
