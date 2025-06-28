import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { VehiculeService } from './vehicule.service';
import { CreateVehiculeDto } from './dto/create-vehicule.dto';
import { UpdateVehiculeDto } from './dto/update-vehicule.dto';

@Controller('vehicule')
export class VehiculeController {
  constructor(private readonly vehiculeService: VehiculeService) {}

  @Post()
  createVehicule(@Body() createVehiculeDto: CreateVehiculeDto) {
    return this.vehiculeService.createVehicule(createVehiculeDto);
  }

  @Get()
  getVehiculesPaginated(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('search') search?: string,
    @Query('showActiveOnly') showActiveOnly?: string,
  ) {
    return this.vehiculeService.getVehiculesPaginated({
      limit,
      offset,
      search,
      showActiveOnly: showActiveOnly === 'true',
    });
  }

  @Get(':id')
  getVehiculeById(@Param('id', ParseUUIDPipe) id: string) {
    return this.vehiculeService.getVehiculeById(id);
  }

  @Patch(':id')
  updateVehicule(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateVehiculeDto: UpdateVehiculeDto,
  ) {
    return this.vehiculeService.updateVehicule(id, updateVehiculeDto);
  }

  @Delete(':id')
  softDeleteVehicule(@Param('id', ParseUUIDPipe) id: string) {
    return this.vehiculeService.softDeleteVehicule(id);
  }
}
