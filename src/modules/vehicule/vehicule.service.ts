import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVehiculeDto } from './dto/create-vehicule.dto';
import { UpdateVehiculeDto } from './dto/update-vehicule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicule } from './entities/vehicule.entity';
import { EntityManager, Repository } from 'typeorm';
import { VehiculeType } from '../vehicule-type/entities/vehicule-type.entity';

@Injectable()
export class VehiculeService {
  constructor(
    @InjectRepository(Vehicule)
    private readonly vehiculeRepository: Repository<Vehicule>,
    @InjectRepository(VehiculeType)
    private readonly vehiculeTypeRepository: Repository<VehiculeType>,
  ) {}
  async createVehicule(
    createVehiculeDto: CreateVehiculeDto,
    manager?: EntityManager,
  ) {
    const { vehiculeType, ...vehiculeDetails } = createVehiculeDto;

    const vehiculeTypeRepo = manager
      ? manager.getRepository(VehiculeType)
      : this.vehiculeTypeRepository;
    const vehiculeRepo = manager
      ? manager.getRepository(Vehicule)
      : this.vehiculeRepository;

    // Resolve vehiculeType
    const vehiculeTypeEntity = await vehiculeTypeRepo.findOne({
      where: { idVehiculeType: vehiculeType },
    });
    if (!vehiculeTypeEntity) {
      throw new NotFoundException(
        `VehiculeType with id ${vehiculeType} not found`,
      );
    }

    const vehicule = vehiculeRepo.create({
      ...vehiculeDetails,
      vehiculeType: vehiculeTypeEntity,
    });

    return await vehiculeRepo.save(vehicule);
  }

  async getVehiculesPaginated({
    limit = 10,
    offset = 0,
    search,
    showActiveOnly,
  }: {
    limit?: number;
    offset?: number;
    search?: string;
    showActiveOnly?: boolean;
  }) {
    const queryBuilder = this.vehiculeRepository
      .createQueryBuilder('vehicule')
      .leftJoinAndSelect('vehicule.vehiculeType', 'vehiculeType')
      .orderBy('vehicule.createdAt', 'DESC')
      .take(limit)
      .skip(offset);

    // Filtro de activos
    if (showActiveOnly !== false) {
      queryBuilder.andWhere('vehicule.active = :active', { active: true });
    }

    // Filtro de búsqueda
    if (search) {
      queryBuilder.andWhere(
        `(LOWER(vehicule.placaCabezote) LIKE :search OR LOWER(vehicule.placaTrailer) LIKE :search OR LOWER(vehiculeType.name) LIKE :search)`,
        { search: `%${search.toLowerCase()}%` },
      );
    }

    const [vehicules, total] = await queryBuilder.getManyAndCount();

    return {
      data: vehicules,
      total,
      limit,
      offset,
    };
  }

  async getVehiculeById(id: string) {
    const vehicule = await this.vehiculeRepository.findOne({
      where: { idVehicule: id, active: true },
      relations: ['vehiculeType'],
    });
    if (!vehicule) {
      throw new NotFoundException(`Vehicule with id ${id} not found`);
    }
    return vehicule;
  }

  async updateVehicule(
    id: string,
    updateVehiculeDto: UpdateVehiculeDto,
    manager?: EntityManager,
  ) {
    const repo = manager
      ? manager.getRepository(Vehicule)
      : this.vehiculeRepository;
    const vehiculeTypeRepo = manager
      ? manager.getRepository(VehiculeType)
      : this.vehiculeTypeRepository;

    const vehicule = await repo.findOne({
      where: { idVehicule: id, active: true },
      relations: ['vehiculeType'],
    });
    if (!vehicule) {
      throw new NotFoundException(`Vehicule with id ${id} not found`);
    }

    // Update vehiculeType if provided
    if (updateVehiculeDto.vehiculeType) {
      const vehiculeTypeEntity = await vehiculeTypeRepo.findOne({
        where: { idVehiculeType: updateVehiculeDto.vehiculeType },
      });
      if (!vehiculeTypeEntity) {
        throw new NotFoundException(
          `VehiculeType with id ${updateVehiculeDto.vehiculeType} not found`,
        );
      }
      vehicule.vehiculeType = vehiculeTypeEntity;
    }

    // Update scalar fields
    if (updateVehiculeDto.placaCabezote !== undefined)
      vehicule.placaCabezote = updateVehiculeDto.placaCabezote;
    if (updateVehiculeDto.placaTrailer !== undefined)
      vehicule.placaTrailer = updateVehiculeDto.placaTrailer;
    if (updateVehiculeDto.kmsSalida !== undefined)
      vehicule.kmsSalida = updateVehiculeDto.kmsSalida;
    if (updateVehiculeDto.active !== undefined)
      vehicule.active = updateVehiculeDto.active;

    return await repo.save(vehicule);
  }

  async softDeleteVehicule(id: string) {
    const vehicule = await this.vehiculeRepository.findOne({
      where: { idVehicule: id, active: true },
    });
    if (!vehicule) {
      throw new NotFoundException(
        `Vehicule with id ${id} not found or already inactive`,
      );
    }
    vehicule.active = false;
    await this.vehiculeRepository.save(vehicule);
    return {
      message: `Vehicule #${id} has been soft deleted (set to inactive).`,
    };
  }
}
