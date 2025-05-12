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
      // Resolve provider
      const provider = await this.providerService.getProviderById(
        createSparePartMaterialDto.provider,
      );
      if (!provider) {
        throw new NotFoundException(
          `Provider with ID ${createSparePartMaterialDto.provider} not found`,
        );
      }

      const sparePartMaterial = this.sparePartMaterialRepository.create({
        ...createSparePartMaterialDto,
        provider,
      });

      return await this.sparePartMaterialRepository.save(sparePartMaterial);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async getAllSparepartMaterials() {
    try {
      const [items, total] =
        await this.sparePartMaterialRepository.findAndCount({
          order: { createdAt: 'DESC' },
          relations: ['provider'],
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
        relations: ['provider'],
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
      // Fetch the existing entity
      const sparePartMaterial = await this.sparePartMaterialRepository.findOne({
        where: { idSparePartMaterial: id },
        relations: ['provider'],
      });

      if (!sparePartMaterial) {
        throw new NotFoundException(
          `SparePartMaterial with ID ${id} not found`,
        );
      }

      // If provider is being updated, resolve the new provider
      if (
        updateSparePartMaterialDto.provider &&
        updateSparePartMaterialDto.provider !==
          (sparePartMaterial.provider?.idProvider || sparePartMaterial.provider)
      ) {
        const provider = await this.providerService.getProviderById(
          updateSparePartMaterialDto.provider,
        );
        if (!provider) {
          throw new NotFoundException(
            `Provider with ID ${updateSparePartMaterialDto.provider} not found`,
          );
        }
        sparePartMaterial.provider = provider;
      }

      // Update scalar fields if provided
      if (updateSparePartMaterialDto.name !== undefined)
        sparePartMaterial.name = updateSparePartMaterialDto.name;
      if (updateSparePartMaterialDto.type !== undefined)
        sparePartMaterial.type = updateSparePartMaterialDto.type;
      if (updateSparePartMaterialDto.measurementUnit !== undefined)
        sparePartMaterial.measurementUnit =
          updateSparePartMaterialDto.measurementUnit;
      if (updateSparePartMaterialDto.unitaryCost !== undefined)
        sparePartMaterial.unitaryCost = updateSparePartMaterialDto.unitaryCost;
      if (updateSparePartMaterialDto.quantity !== undefined)
        sparePartMaterial.quantity = updateSparePartMaterialDto.quantity;
      if (updateSparePartMaterialDto.active !== undefined)
        sparePartMaterial.active = updateSparePartMaterialDto.active;

      // Save the updated entity
      const updated =
        await this.sparePartMaterialRepository.save(sparePartMaterial);
      return updated;
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
