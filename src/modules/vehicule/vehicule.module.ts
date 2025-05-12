import { Module } from '@nestjs/common';
import { VehiculeService } from './vehicule.service';
import { VehiculeController } from './vehicule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicule } from './entities/vehicule.entity';
import { VehiculeTypeModule } from '../vehicule-type/vehicule-type.module';
import { DriverModule } from '../driver/driver.module';

@Module({
  controllers: [VehiculeController],
  providers: [VehiculeService],
  imports: [
    TypeOrmModule.forFeature([Vehicule]),
    VehiculeTypeModule,
    DriverModule,
  ],
  exports: [TypeOrmModule],
})
export class VehiculeModule {}
