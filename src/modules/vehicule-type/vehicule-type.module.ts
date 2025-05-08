import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiculeType } from './entities/vehicule-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VehiculeType])],
  exports: [TypeOrmModule],
})
export class VehiculeTypeModule {}
