import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBillingDto } from './dto/create-billing.dto';
import { UpdateBillingDto } from './dto/update-billing.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Billing } from './entities/billing.entity';
import { EntityManager, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(Billing)
    private readonly billingRepository: Repository<Billing>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async createBilling(
    createBillingDto: CreateBillingDto,
    manager?: EntityManager,
  ): Promise<Billing> {
    const { billedBy, ...billingDetails } = createBillingDto;

    // Find user
    const userRepo = manager
      ? manager.getRepository(User)
      : this.userRepository;
    const selectedUser = await userRepo.findOneBy({
      idUser: billedBy,
    });

    if (!selectedUser) {
      throw new NotFoundException(`User with ID ${billedBy} not found`);
    }

    // Create a new billing entity from the DTO
    const repo = manager
      ? manager.getRepository(Billing)
      : this.billingRepository;

    const billing = repo.create({
      ...billingDetails,
      billedBy: selectedUser,
    });

    // Save the billing entity to the database
    return await repo.save(billing);
  }
  async getBillingById(id: string): Promise<Billing> {
    const billing = await this.billingRepository.findOne({
      where: { idBilling: id },
      relations: ['billedBy'],
    });
    if (!billing) {
      throw new NotFoundException(`Billing with ID ${id} not found`);
    }
    return billing;
  }

  async updateBilling(
    id: string,
    updateBillingDto: UpdateBillingDto,
  ): Promise<Billing> {
    const billing = await this.billingRepository.findOne({
      where: { idBilling: id },
      relations: ['billedBy'],
    });
    if (!billing) {
      throw new NotFoundException(`Billing with ID ${id} not found`);
    }

    // If billedBy is being updated, validate the user exists
    if (updateBillingDto.billedBy) {
      const user = await this.userRepository.findOneBy({
        idUser: updateBillingDto.billedBy,
      });
      if (!user) {
        throw new NotFoundException(
          `User with ID ${updateBillingDto.billedBy} not found`,
        );
      }
      billing.billedBy = user;
    }

    // Update other fields
    if (updateBillingDto.billingNumber !== undefined)
      billing.billingNumber = updateBillingDto.billingNumber;
    if (updateBillingDto.billingDate !== undefined)
      billing.billingDate = updateBillingDto.billingDate;
    if (updateBillingDto.active !== undefined)
      billing.active = updateBillingDto.active;

    return await this.billingRepository.save(billing);
  }
  async softDeleteBilling(id: string): Promise<{ message: string }> {
    const billing = await this.billingRepository.findOne({
      where: { idBilling: id, active: true },
    });
    if (!billing) {
      throw new NotFoundException(
        `Billing with ID ${id} not found or already inactive`,
      );
    }
    billing.active = false;
    await this.billingRepository.save(billing);
    return {
      message: `Billing #${id} has been soft deleted (set to inactive).`,
    };
  }
}
