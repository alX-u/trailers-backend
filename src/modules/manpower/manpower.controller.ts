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

  @Get()
  getAllManpower(@Query('filter') filter?: string) {
    return this.manpowerService.getAllManpower(filter);
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
