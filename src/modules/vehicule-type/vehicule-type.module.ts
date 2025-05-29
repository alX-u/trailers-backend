import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiculeType } from './entities/vehicule-type.entity';
import { VehiculeTypeService } from './vehicule-type.service';
import { VehiculeTypeController } from './vehicule-type.controller';

@Module({
  imports: [TypeOrmModule.forFeature([VehiculeType])],
  exports: [TypeOrmModule],
  providers: [VehiculeTypeService],
  controllers: [VehiculeTypeController],
})
export class VehiculeTypeModule {}
