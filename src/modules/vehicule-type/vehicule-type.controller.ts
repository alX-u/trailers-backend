import { Controller, Get } from '@nestjs/common';
import { VehiculeTypeService } from './vehicule-type.service';

@Controller('vehicule-type')
export class VehiculeTypeController {
  constructor(private readonly vehiculeTypeService: VehiculeTypeService) {}

  @Get()
  getAllVehiculeTypes() {
    return this.vehiculeTypeService.getAllVehiculeTypes();
  }
}
