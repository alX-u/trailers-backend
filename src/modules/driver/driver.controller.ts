import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { DriverService } from './driver.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';

@Controller('driver')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Post()
  createDriver(@Body() createDriverDto: CreateDriverDto) {
    return this.driverService.createDriver(createDriverDto);
  }

  @Get()
  getAllDrivers(
    @Query('search') search?: string,
    @Query('showActiveOnly') showActiveOnly?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.driverService.getAllDrivers({
      search,
      showActiveOnly: showActiveOnly === 'true',
      limit,
      offset,
    });
  }

  @Get(':id')
  getDriverById(@Param('id') id: string) {
    return this.driverService.getDriverById(id);
  }

  @Get('document/:documentNumber')
  getDriverByDocumentNumber(@Param('documentNumber') documentNumber: string) {
    return this.driverService.getDriverByDocumentNumber(documentNumber);
  }

  @Patch(':id')
  updateDriver(
    @Param('id') id: string,
    @Body() updateDriverDto: UpdateDriverDto,
  ) {
    return this.driverService.updateDriver(id, updateDriverDto);
  }

  @Delete(':id')
  softDeleteDriver(@Param('id') id: string) {
    return this.driverService.softDeleteDriver(id);
  }
}
