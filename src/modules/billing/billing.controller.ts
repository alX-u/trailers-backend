import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BillingService } from './billing.service';
import { CreateBillingDto } from './dto/create-billing.dto';
import { UpdateBillingDto } from './dto/update-billing.dto';

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post()
  createBilling(@Body() createBillingDto: CreateBillingDto) {
    return this.billingService.createBilling(createBillingDto);
  }

  @Get()
  getBillingById(@Param('id') id: string) {
    return this.billingService.getBillingById(id);
  }

  @Patch(':id')
  updateBilling(
    @Param('id') id: string,
    @Body() updateBillingDto: UpdateBillingDto,
  ) {
    return this.billingService.updateBilling(id, updateBillingDto);
  }

  @Delete(':id')
  softDeleteBilling(@Param('id') id: string) {
    return this.billingService.softDeleteBilling(id);
  }
}
