import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePricingDto } from './dto/create-pricing.dto';
import { UpdatePricingDto } from './dto/update-pricing.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pricing } from './entities/pricing.entity';
import { EntityManager, Repository } from 'typeorm';
import { UserService } from '../user/user.service';

@Injectable()
export class PricingService {
  constructor(
    @InjectRepository(Pricing)
    private readonly pricingRepository: Repository<Pricing>,
    private readonly userService: UserService,
  ) {}
  async createPricing(
    createPricingDto: CreatePricingDto,
    manager?: EntityManager,
  ) {
    try {
      // Find the user who is pricing
      const user = await this.userService.getUserById(
        createPricingDto.pricedBy,
      );
      if (!user) {
        throw new NotFoundException(
          `User with ID ${createPricingDto.pricedBy} not found`,
        );
      }

      const repo = manager
        ? manager.getRepository(Pricing)
        : this.pricingRepository;

      const newPricing = repo.create({
        pricingNumber: createPricingDto.pricingNumber,
        pricingDate: createPricingDto.pricingDate,
        pricedBy: user,
      });

      return await repo.save(newPricing);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async getPricingById(id: string) {
    try {
      const pricing = await this.pricingRepository.findOne({
        where: { idPricing: id },
        relations: ['pricedBy'],
      });

      if (!pricing) {
        throw new NotFoundException(`Pricing with ID ${id} not found`);
      }

      return pricing;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async updatePricing(id: string, updatePricingDto: UpdatePricingDto) {
    try {
      const pricing = await this.pricingRepository.findOne({
        where: { idPricing: id },
        relations: ['pricedBy'],
      });

      if (!pricing) {
        throw new NotFoundException(`Pricing with ID ${id} not found`);
      }

      // Update fields if provided
      if (updatePricingDto.pricingNumber !== undefined) {
        pricing.pricingNumber = updatePricingDto.pricingNumber;
      }
      if (updatePricingDto.pricingDate !== undefined) {
        pricing.pricingDate = updatePricingDto.pricingDate;
      }
      if (updatePricingDto.pricedBy !== undefined) {
        const user = await this.userService.getUserById(
          updatePricingDto.pricedBy,
        );
        if (!user) {
          throw new BadRequestException(
            `User with ID ${updatePricingDto.pricedBy} not found`,
          );
        }
        pricing.pricedBy = user;
      }
      if (updatePricingDto.active !== undefined) {
        pricing.active = updatePricingDto.active;
      }

      return await this.pricingRepository.save(pricing);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async softDeletePricing(id: string) {
    try {
      const pricing = await this.pricingRepository.findOne({
        where: { idPricing: id },
      });

      if (!pricing) {
        throw new NotFoundException(`Pricing with ID ${id} not found`);
      }

      await this.pricingRepository.softRemove(pricing);

      return {
        message: `Pricing with ID ${id} has been soft deleted successfully.`,
        pricing,
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
