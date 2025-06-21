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
    const { name, contractors } = createManpowerDto;

    let contractorUsers = [];
    if (contractors && contractors.length > 0) {
      contractorUsers = await Promise.all(
        contractors.map(async (contractorId) => {
          const user = await this.userService.getUserById(contractorId);
          if (!user) {
            throw new NotFoundException(
              `User (contractor) with id ${contractorId} not found`,
            );
          }
          return user;
        }),
      );
    }

    const manpower = this.manpowerRepository.create({
      name,

      contractors: contractorUsers,
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
        'contractors',
        'contractors.document',
        'contractors.document.documentType',
      ],
    });
  }

  async getManpowerById(id: string) {
    const manpower = await this.manpowerRepository.findOne({
      where: { idManpower: id, active: true },
      relations: [
        'contractors',
        'contractors.document',
        'contractors.document.documentType',
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
        'contractors',
        'contractors.document',
        'contractors.document.documentType',
      ],
    });
    if (!manpower) {
      throw new NotFoundException(`Manpower with id ${id} not found`);
    }

    if (updateManpowerDto.name !== undefined)
      manpower.name = updateManpowerDto.name;
    if (updateManpowerDto.active !== undefined)
      manpower.active = updateManpowerDto.active;

    if (updateManpowerDto.contractors !== undefined) {
      if (
        updateManpowerDto.contractors &&
        updateManpowerDto.contractors.length > 0
      ) {
        const contractorUsers = await Promise.all(
          updateManpowerDto.contractors.map(async (contractorId) => {
            const user = await this.userService.getUserById(contractorId);
            if (!user) {
              throw new NotFoundException(
                `User (contractor) with id ${contractorId} not found`,
              );
            }
            return user;
          }),
        );
        manpower.contractors = contractorUsers;
      } else {
        manpower.contractors = [];
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
