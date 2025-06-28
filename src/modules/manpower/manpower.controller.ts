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
import { ManpowerService } from './manpower.service';
import { CreateManpowerDto } from './dto/create-manpower.dto';
import { UpdateManpowerDto } from './dto/update-manpower.dto';

@Controller('manpower')
export class ManpowerController {
  constructor(private readonly manpowerService: ManpowerService) {}

  @Post()
  createManpower(@Body() createManpowerDto: CreateManpowerDto) {
    return this.manpowerService.createManpower(createManpowerDto);
  }

  @Get('all')
  getAllManpowersNoPagination(
    @Query('search') search?: string,
    @Query('showActiveOnly') showActiveOnly?: string,
  ) {
    return this.manpowerService.getAllManpowersNoPagination(
      search,
      showActiveOnly === 'true',
    );
  }

  @Get()
  getAllManpower(
    @Query('search') search?: string,
    @Query('showActiveOnly') showActiveOnly?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.manpowerService.getAllManpower(
      search,
      showActiveOnly === 'true',
      limit,
      offset,
    );
  }

  @Get(':id')
  getManpowerById(@Param('id') id: string) {
    return this.manpowerService.getManpowerById(id);
  }

  @Patch(':id')
  updateManpower(
    @Param('id') id: string,
    @Body() updateManpowerDto: UpdateManpowerDto,
  ) {
    return this.manpowerService.updateManpower(id, updateManpowerDto);
  }

  @Delete(':id')
  softDeleteManpower(@Param('id') id: string) {
    return this.manpowerService.softDeleteManpower(id);
  }
}
