import { Injectable } from '@nestjs/common';
import { CreateManpowerDto } from './dto/create-manpower.dto';
import { UpdateManpowerDto } from './dto/update-manpower.dto';

@Injectable()
export class ManpowerService {
  create(createManpowerDto: CreateManpowerDto) {
    return 'This action adds a new manpower';
  }

  findAll() {
    return `This action returns all manpower`;
  }

  findOne(id: number) {
    return `This action returns a #${id} manpower`;
  }

  update(id: number, updateManpowerDto: UpdateManpowerDto) {
    return `This action updates a #${id} manpower`;
  }

  remove(id: number) {
    return `This action removes a #${id} manpower`;
  }
}
