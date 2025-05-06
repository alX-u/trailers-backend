import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ManpowerService } from './manpower.service';
import { CreateManpowerDto } from './dto/create-manpower.dto';
import { UpdateManpowerDto } from './dto/update-manpower.dto';

@Controller('manpower')
export class ManpowerController {
  constructor(private readonly manpowerService: ManpowerService) {}

  @Post()
  create(@Body() createManpowerDto: CreateManpowerDto) {
    return this.manpowerService.create(createManpowerDto);
  }

  @Get()
  findAll() {
    return this.manpowerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.manpowerService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateManpowerDto: UpdateManpowerDto,
  ) {
    return this.manpowerService.update(+id, updateManpowerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.manpowerService.remove(+id);
  }
}
