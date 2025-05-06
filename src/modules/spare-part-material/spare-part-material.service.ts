import { Injectable } from '@nestjs/common';
import { CreateSparePartMaterialDto } from './dto/create-spare-part-material.dto';
import { UpdateSparePartMaterialDto } from './dto/update-spare-part-material.dto';

@Injectable()
export class SparePartMaterialService {
  create(createSparePartMaterialDto: CreateSparePartMaterialDto) {
    return 'This action adds a new sparePartMaterial';
  }

  findAll() {
    return `This action returns all sparePartMaterial`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sparePartMaterial`;
  }

  update(id: number, updateSparePartMaterialDto: UpdateSparePartMaterialDto) {
    return `This action updates a #${id} sparePartMaterial`;
  }

  remove(id: number) {
    return `This action removes a #${id} sparePartMaterial`;
  }
}
