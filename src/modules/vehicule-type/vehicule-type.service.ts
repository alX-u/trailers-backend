import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VehiculeType } from './entities/vehicule-type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VehiculeTypeService {
  constructor(
    @InjectRepository(VehiculeType)
    private readonly vehiculeTypeRepository: Repository<VehiculeType>,
  ) {}

  async getAllVehiculeTypes() {
    return await this.vehiculeTypeRepository.find();
  }
}
