import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateManpowerDto } from './dto/create-manpower.dto';
import { UpdateManpowerDto } from './dto/update-manpower.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Manpower } from './entities/manpower.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ManpowerService {
  constructor(
    @InjectRepository(Manpower)
    private readonly manpowerRepository: Repository<Manpower>,
  ) {}

  async createManpower(createManpowerDto: CreateManpowerDto) {
    const { name, type } = createManpowerDto;

    // Create and save the manpower entity
    const manpower = this.manpowerRepository.create({
      name,
      type,

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
    });
  }

  async getManpowerById(id: string) {
    const manpower = await this.manpowerRepository.findOne({
      where: { idManpower: id, active: true },
    });
    if (!manpower) {
      throw new NotFoundException(`Manpower with id ${id} not found`);
    }
    return manpower;
  }

  async updateManpower(id: string, updateManpowerDto: UpdateManpowerDto) {
    const manpower = await this.manpowerRepository.findOne({
      where: { idManpower: id, active: true },
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
