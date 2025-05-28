import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceType } from './entities/service-type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ServiceTypeService {
  constructor(
    @InjectRepository(ServiceType)
    private readonly serviceTypeRepository: Repository<ServiceType>,
  ) {}

  async getAllServiceTypes() {
    return await this.serviceTypeRepository.find();
  }
}
