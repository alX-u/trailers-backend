import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
  getAllDrivers() {
    return this.driverService.getAllDrivers();
  }

  @Get(':id')
  getDriverById(@Param('id') id: string) {
    return this.driverService.getDriverById(id);
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
