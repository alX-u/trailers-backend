import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Supply } from './entities/supply.entity';
import { Repository } from 'typeorm';
import { CreateSupplyDto } from './dto/create-supply.dto';
import { UpdateSupplyDto } from './dto/update-supply.dto';
import { ProviderService } from '../provider/provider.service';

@Injectable()
export class SupplyService {
  constructor(
    @InjectRepository(Supply)
    private readonly supplyRepository: Repository<Supply>,
    private readonly providerService: ProviderService,
  ) {}

  async create(createSupplyDto: CreateSupplyDto) {
    let providers = [];
    if (createSupplyDto.providers && createSupplyDto.providers.length > 0) {
      providers = await Promise.all(
        createSupplyDto.providers.map(async (id) => {
          const provider = await this.providerService.getProviderById(id);
          if (!provider)
            throw new NotFoundException(`Provider ${id} not found`);
          return provider;
        }),
      );
    }

    const supply = this.supplyRepository.create({
      ...createSupplyDto,
      providers,
    });
    return this.supplyRepository.save(supply);
  }

  async findAllNoPagination(
    search?: string,
    showActiveOnly?: boolean,
  ): Promise<Supply[]> {
    const queryBuilder = this.supplyRepository
      .createQueryBuilder('supply')
      .leftJoinAndSelect('supply.providers', 'providers')
      .orderBy('supply.createdAt', 'DESC');

    if (showActiveOnly !== false) {
      queryBuilder.andWhere('supply.active = :active', { active: true });
    }

    if (search) {
      queryBuilder.andWhere('LOWER(supply.name) LIKE :search', {
        search: `%${search.toLowerCase()}%`,
      });
    }

    return await queryBuilder.getMany();
  }

  async findAllPaginated(
    search?: string,
    showActiveOnly?: boolean,
    limit?: number,
    offset?: number,
  ): Promise<{ data: Supply[]; total: number; limit: number; offset: number }> {
    const take = limit ?? 10;
    const skip = offset ?? 0;

    const queryBuilder = this.supplyRepository
      .createQueryBuilder('supply')
      .leftJoinAndSelect('supply.providers', 'providers')
      .orderBy('supply.createdAt', 'DESC')
      .take(take)
      .skip(skip);

    // Filtro de activos
    if (showActiveOnly !== false) {
      queryBuilder.andWhere('supply.active = :active', { active: true });
    }

    // Filtro de búsqueda por nombre
    if (search) {
      queryBuilder.andWhere('LOWER(supply.name) LIKE :search', {
        search: `%${search.toLowerCase()}%`,
      });
    }

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total, limit: take, offset: skip };
  }

  async findOne(id: string) {
    const supply = await this.supplyRepository.findOne({
      where: { idSupply: id },
      relations: ['providers'],
    });
    if (!supply) throw new NotFoundException(`Supply ${id} not found`);
    return supply;
  }

  async update(id: string, updateSupplyDto: UpdateSupplyDto) {
    const supply = await this.supplyRepository.findOne({
      where: { idSupply: id },
      relations: ['providers'],
    });
    if (!supply) throw new NotFoundException(`Supply ${id} not found`);

    if (updateSupplyDto.providers) {
      supply.providers = await Promise.all(
        updateSupplyDto.providers.map(async (id) => {
          const provider = await this.providerService.getProviderById(id);
          if (!provider)
            throw new NotFoundException(`Provider ${id} not found`);
          return provider;
        }),
      );
    }

    if (updateSupplyDto.name !== undefined) supply.name = updateSupplyDto.name;
    if (updateSupplyDto.measurementUnit !== undefined)
      supply.measurementUnit = updateSupplyDto.measurementUnit;

    return this.supplyRepository.save(supply);
  }

  async remove(id: string) {
    const supply = await this.supplyRepository.findOne({
      where: { idSupply: id },
    });
    if (!supply) throw new NotFoundException(`Supply ${id} not found`);
    supply.active = false;
    await this.supplyRepository.save(supply);
    return { deleted: true };
  }
}
