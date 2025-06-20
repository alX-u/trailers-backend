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
    const { name, type, contractor } = createManpowerDto;

    let contractorUser = null;
    if (contractor) {
      contractorUser = await this.userService.getUserById(contractor);
      if (!contractorUser) {
        throw new NotFoundException(
          `User (contractor) with id ${contractor} not found`,
        );
      }
    }

    const manpower = this.manpowerRepository.create({
      name,
      type,
      contractor: contractorUser,
      active: true,
    });

    return await this.manpowerRepository.save(manpower);
  }

  async getAllManpower(filter?: string) {
    let whereClause = {};
    if (filter === 'Activo') {
      whereClause = { active: true };
    }

    return await this.manpowerRepository.find({
      where: whereClause,
      order: { createdAt: 'DESC' },
      relations: [
        'contractor',
        'contractor.document',
        'contractor.document.documentType',
      ],
    });
  }

  async getManpowerById(id: string) {
    const manpower = await this.manpowerRepository.findOne({
      where: { idManpower: id, active: true },
      relations: [
        'contractor',
        'contractor.document',
        'contractor.document.documentType',
      ],
    });
    if (!manpower) {
      throw new NotFoundException(`Manpower with id ${id} not found`);
    }
    return manpower;
  }

  async updateManpower(id: string, updateManpowerDto: UpdateManpowerDto) {
    const manpower = await this.manpowerRepository.findOne({
      where: { idManpower: id, active: true },
      relations: [
        'contractor',
        'contractor.document',
        'contractor.document.documentType',
      ],
    });
    if (!manpower) {
      throw new NotFoundException(`Manpower with id ${id} not found`);
    }

    if (updateManpowerDto.name !== undefined)
      manpower.name = updateManpowerDto.name;
    if (updateManpowerDto.type !== undefined)
      manpower.type = updateManpowerDto.type;
    if (updateManpowerDto.active !== undefined)
      manpower.active = updateManpowerDto.active;

    if (updateManpowerDto.contractor !== undefined) {
      if (updateManpowerDto.contractor) {
        const contractorUser = await this.userService.getUserById(
          updateManpowerDto.contractor,
        );
        if (!contractorUser) {
          throw new NotFoundException(
            `User (contractor) with id ${updateManpowerDto.contractor} not found`,
          );
        }
        manpower.contractor = contractorUser;
      } else {
        manpower.contractor = null;
      }
    }

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
