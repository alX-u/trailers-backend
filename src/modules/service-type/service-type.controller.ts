import { Controller, Get } from '@nestjs/common';
import { ServiceTypeService } from './service-type.service';

@Controller('service-type')
export class ServiceTypeController {
  constructor(private readonly serviceTypeService: ServiceTypeService) {}

  @Get()
  getAllServiceTypes() {
    return this.serviceTypeService.getAllServiceTypes();
  }

  @Get(':id')
  getServiceTypeById(id: string) {
    return this.serviceTypeService.getServiceTypeById(id);
  }
}
