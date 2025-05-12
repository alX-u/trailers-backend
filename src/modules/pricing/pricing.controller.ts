import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PricingService } from './pricing.service';
import { CreatePricingDto } from './dto/create-pricing.dto';
import { UpdatePricingDto } from './dto/update-pricing.dto';

@Controller('pricing')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Post()
  createPricing(@Body() createPricingDto: CreatePricingDto) {
    return this.pricingService.createPricing(createPricingDto);
  }

  @Get(':id')
  getPricingById(@Param('id') id: string) {
    return this.pricingService.getPricingById(id);
  }

  @Patch(':id')
  updatePricing(
    @Param('id') id: string,
    @Body() updatePricingDto: UpdatePricingDto,
  ) {
    return this.pricingService.updatePricing(id, updatePricingDto);
  }

  @Delete(':id')
  softDeletePricing(@Param('id') id: string) {
    return this.pricingService.softDeletePricing(id);
  }
}
