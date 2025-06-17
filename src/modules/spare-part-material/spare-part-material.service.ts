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

  async getAllSparepartMaterials(filter?: string) {
    try {
      const whereClause = filter === 'Activo' ? { active: true } : {};

      const [items, total] =
        await this.sparePartMaterialRepository.findAndCount({
          where: whereClause,
          order: { createdAt: 'DESC' },
          relations: ['providers'],
        });

      return {
        data: items,
        total,
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
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
