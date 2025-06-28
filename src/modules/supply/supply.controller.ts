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
import { SupplyService } from './supply.service';
import { CreateSupplyDto } from './dto/create-supply.dto';
import { UpdateSupplyDto } from './dto/update-supply.dto';

@Controller('supply')
export class SupplyController {
  constructor(private readonly supplyService: SupplyService) {}

  @Post()
  create(@Body() createSupplyDto: CreateSupplyDto) {
    return this.supplyService.create(createSupplyDto);
  }

  @Get('all')
  findAllNoPagination(
    @Query('search') search?: string,
    @Query('showActiveOnly') showActiveOnly?: string,
  ) {
    return this.supplyService.findAllNoPagination(
      search,
      showActiveOnly === 'true',
    );
  }

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('showActiveOnly') showActiveOnly?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.supplyService.findAllPaginated(
      search,
      showActiveOnly === 'true',
      limit,
      offset,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.supplyService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSupplyDto: UpdateSupplyDto) {
    return this.supplyService.update(id, updateSupplyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.supplyService.remove(id);
  }
}
