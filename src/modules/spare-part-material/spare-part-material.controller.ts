import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
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
  createSparepartMaterial(
    @Body() createSparePartMaterialDto: CreateSparePartMaterialDto,
  ) {
    return this.sparePartMaterialService.createSparepartMaterial(
      createSparePartMaterialDto,
    );
  }

  @Get('all')
  getAllSparepartMaterialsNoPagination(
    @Query('search') search?: string,
    @Query('showActiveOnly') showActiveOnly?: string,
  ) {
    return this.sparePartMaterialService.getAllSparepartMaterialsNoPagination(
      search,
      showActiveOnly === 'true',
    );
  }

  @Get()
  async getAllSparePartMaterials(
    @Query('search') search?: string,
    @Query('showActiveOnly') showActiveOnly?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.sparePartMaterialService.getAllSparepartMaterials(
      search,
      showActiveOnly === 'true',
      limit,
      offset,
    );
  }

  @Get(':id')
  getSparepartMaterialById(@Param('id', ParseUUIDPipe) id: string) {
    return this.sparePartMaterialService.getSparepartMaterialById(id);
  }

  @Patch(':id')
  updateSparepartMaterial(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSparePartMaterialDto: UpdateSparePartMaterialDto,
  ) {
    return this.sparePartMaterialService.updateSparepartMaterial(
      id,
      updateSparePartMaterialDto,
    );
  }

  @Delete(':id')
  softDeleteSparepartMaterial(@Param('id', ParseUUIDPipe) id: string) {
    return this.sparePartMaterialService.softDeleteSparepartMaterial(id);
  }
}
