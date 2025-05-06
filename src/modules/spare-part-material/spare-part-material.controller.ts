import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SparePartMaterialService } from './spare-part-material.service';
import { CreateSparePartMaterialDto } from './dto/create-spare-part-material.dto';
import { UpdateSparePartMaterialDto } from './dto/update-spare-part-material.dto';

@Controller('spare-part-material')
export class SparePartMaterialController {
  constructor(
    private readonly sparePartMaterialService: SparePartMaterialService,
  ) {}

  @Post()
  create(@Body() createSparePartMaterialDto: CreateSparePartMaterialDto) {
    return this.sparePartMaterialService.create(createSparePartMaterialDto);
  }

  @Get()
  findAll() {
    return this.sparePartMaterialService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sparePartMaterialService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSparePartMaterialDto: UpdateSparePartMaterialDto,
  ) {
    return this.sparePartMaterialService.update(
      +id,
      updateSparePartMaterialDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sparePartMaterialService.remove(+id);
  }
}
