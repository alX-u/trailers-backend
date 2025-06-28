import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateSparePartMaterialDto } from './dto/create-spare-part-material.dto';
import { UpdateSparePartMaterialDto } from './dto/update-spare-part-material.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SparePartMaterial } from './entities/spare-part-material.entity';
import { Repository } from 'typeorm';
import { ProviderService } from '../provider/provider.service';

@Injectable()
export class SparePartMaterialService {
  constructor(
    @InjectRepository(SparePartMaterial)
    private readonly sparePartMaterialRepository: Repository<SparePartMaterial>,
    private readonly providerService: ProviderService,
  ) {}
  async createSparepartMaterial(
    createSparePartMaterialDto: CreateSparePartMaterialDto,
  ) {
    try {
      const providers = await Promise.all(
        (createSparePartMaterialDto.providers || []).map(async (providerId) => {
          const provider =
            await this.providerService.getProviderById(providerId);
          if (!provider) {
            throw new NotFoundException(
              `Provider with ID ${providerId} not found`,
            );
          }
          return provider;
        }),
      );

      const sparePartMaterial = this.sparePartMaterialRepository.create({
        ...createSparePartMaterialDto,
        providers,
      });

      return await this.sparePartMaterialRepository.save(sparePartMaterial);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async getAllSparepartMaterialsNoPagination(
    search?: string,
    showActiveOnly?: boolean,
  ): Promise<SparePartMaterial[]> {
    const queryBuilder = this.sparePartMaterialRepository
      .createQueryBuilder('sparePartMaterial')
      .leftJoinAndSelect('sparePartMaterial.providers', 'providers')
      .orderBy('sparePartMaterial.createdAt', 'DESC');

    // Filtro de activos
    if (showActiveOnly !== false) {
      queryBuilder.andWhere('sparePartMaterial.active = :active', {
        active: true,
      });
    }

    // Filtro de búsqueda por nombre
    if (search) {
      queryBuilder.andWhere('LOWER(sparePartMaterial.name) LIKE :search', {
        search: `%${search.toLowerCase()}%`,
      });
    }

    return await queryBuilder.getMany();
  }

  async getAllSparepartMaterials(
    search?: string,
    showActiveOnly?: boolean,
    limit?: number,
    offset?: number,
  ): Promise<{
    data: SparePartMaterial[];
    total: number;
    limit: number;
    offset: number;
  }> {
    const take = limit ?? 10;
    const skip = offset ?? 0;

    const queryBuilder = this.sparePartMaterialRepository
      .createQueryBuilder('sparePartMaterial')
      .leftJoinAndSelect('sparePartMaterial.providers', 'providers')
      .orderBy('sparePartMaterial.createdAt', 'DESC')
      .take(take)
      .skip(skip);

    // Filtro de activos
    if (showActiveOnly !== false) {
      queryBuilder.andWhere('sparePartMaterial.active = :active', {
        active: true,
      });
    }

    // Filtro de búsqueda por nombre
    if (search) {
      queryBuilder.andWhere('LOWER(sparePartMaterial.name) LIKE :search', {
        search: `%${search.toLowerCase()}%`,
      });
    }

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total, limit: take, offset: skip };
  }

  async getSparepartMaterialById(id: string) {
    try {
      const item = await this.sparePartMaterialRepository.findOne({
        where: { idSparePartMaterial: id },
        relations: ['providers'],
      });

      if (!item) {
        throw new NotFoundException(
          `SparePartMaterial with ID ${id} not found`,
        );
      }

      return item;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async updateSparepartMaterial(
    id: string,
    updateSparePartMaterialDto: UpdateSparePartMaterialDto,
  ) {
    try {
      const sparePartMaterial = await this.sparePartMaterialRepository.findOne({
        where: { idSparePartMaterial: id },
        relations: ['providers'],
      });

      if (!sparePartMaterial) {
        throw new NotFoundException(
          `SparePartMaterial with ID ${id} not found`,
        );
      }

      // Si se actualizan los proveedores
      if (updateSparePartMaterialDto.providers) {
        const providers = await Promise.all(
          updateSparePartMaterialDto.providers.map(async (providerId) => {
            const provider =
              await this.providerService.getProviderById(providerId);
            if (!provider) {
              throw new NotFoundException(
                `Provider with ID ${providerId} not found`,
              );
            }
            return provider;
          }),
        );
        sparePartMaterial.providers = providers;
      }

      // Actualiza otros campos según tu DTO...
      if (updateSparePartMaterialDto.name !== undefined)
        sparePartMaterial.name = updateSparePartMaterialDto.name;
      // ...otros campos...

      return await this.sparePartMaterialRepository.save(sparePartMaterial);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async softDeleteSparepartMaterial(id: string) {
    try {
      const sparePartMaterial = await this.sparePartMaterialRepository.findOne({
        where: { idSparePartMaterial: id },
      });

      if (!sparePartMaterial) {
        throw new NotFoundException(
          `SparePartMaterial with ID ${id} not found`,
        );
      }

      sparePartMaterial.active = false;

      await this.sparePartMaterialRepository.save(sparePartMaterial);

      return {
        message: `SparePartMaterial with ID ${id} has been soft deleted successfully.`,
        sparePartMaterial,
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    throw new InternalServerErrorException('Unexpected error, check logs');
  }
}
