import { Module } from '@nestjs/common';
import { OrderStatus } from './entities/order-status.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({ imports: [TypeOrmModule.forFeature([OrderStatus])] })
export class OrderStatusModule {}
