import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateManpowerDto } from './dto/create-manpower.dto';
import { UpdateManpowerDto } from './dto/update-manpower.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Manpower } from './entities/manpower.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';

@Injectable()
export class ManpowerService {
  constructor(
    @InjectRepository(Manpower)
    private readonly manpowerRepository: Repository<Manpower>,
    private readonly userService: UserService,
  ) {}
  async createManpower(createManpowerDto: CreateManpowerDto) {
    const { name, type, unitaryCost, contractor } = createManpowerDto;

    // Validate contractor (user) exists
    const contractorUser = await this.userService.getUserById(contractor);
    if (!contractorUser) {
      throw new NotFoundException(
        `Contractor (user) with id ${contractor} not found`,
      );
    }

    // Create and save the manpower entity
    const manpower = this.manpowerRepository.create({
      name,
      type,
      unitaryCost,
      contractor: contractorUser,
      active: true,
    });

    return await this.manpowerRepository.save(manpower);
  }

  async getAllManpower() {
    return await this.manpowerRepository.find({
      where: { active: true },
      relations: ['contractor', 'contractor.document'],
      order: { createdAt: 'DESC' },
    });
  }

  async getManpowerById(id: string) {
    const manpower = await this.manpowerRepository.findOne({
      where: { idManpower: id, active: true },
      relations: ['contractor', 'contractor.document'],
    });
    if (!manpower) {
      throw new NotFoundException(`Manpower with id ${id} not found`);
    }
    return manpower;
  }

  async updateManpower(id: string, updateManpowerDto: UpdateManpowerDto) {
    const manpower = await this.manpowerRepository.findOne({
      where: { idManpower: id, active: true },
      relations: ['contractor'],
    });
    if (!manpower) {
      throw new NotFoundException(`Manpower with id ${id} not found`);
    }

    // If contractor is being updated, validate the new contractor exists
    if (updateManpowerDto.contractor) {
      const contractorUser = await this.userService.getUserById(
        updateManpowerDto.contractor,
      );
      if (!contractorUser) {
        throw new NotFoundException(
          `Contractor (user) with id ${updateManpowerDto.contractor} not found`,
        );
      }
      manpower.contractor = contractorUser;
    }

    if (updateManpowerDto.name !== undefined)
      manpower.name = updateManpowerDto.name;
    if (updateManpowerDto.type !== undefined)
      manpower.type = updateManpowerDto.type;
    if (updateManpowerDto.unitaryCost !== undefined)
      manpower.unitaryCost = updateManpowerDto.unitaryCost;
    if (updateManpowerDto.active !== undefined)
      manpower.active = updateManpowerDto.active;

    return await this.manpowerRepository.save(manpower);
  }

  async softDeleteManpower(id: string) {
    const manpower = await this.manpowerRepository.findOne({
      where: { idManpower: id, active: true },
    });
    if (!manpower) {
      throw new NotFoundException(
        `Manpower with id ${id} not found or already inactive`,
      );
    }
    manpower.active = false;
    await this.manpowerRepository.save(manpower);
    return {
      message: `Manpower #${id} has been soft deleted (set to inactive).`,
    };
  }
}
