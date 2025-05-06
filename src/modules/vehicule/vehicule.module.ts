import { Module } from '@nestjs/common';
import { VehiculeService } from './vehicule.service';
import { VehiculeController } from './vehicule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicule } from './entities/vehicule.entity';

@Module({
  controllers: [VehiculeController],
  providers: [VehiculeService],
  imports: [TypeOrmModule.forFeature([Vehicule])],
})
export class VehiculeModule {}
