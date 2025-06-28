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
import { ProviderService } from './provider.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';

@Controller('provider')
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  //Create a provider
  @Post()
  createProvider(@Body() createProviderDto: CreateProviderDto) {
    return this.providerService.createProvider(createProviderDto);
  }

  //Get all providers with pagination
  @Get()
  getProviders(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('search') search?: string,
    @Query('showActiveOnly') showActiveOnly?: string,
  ) {
    return this.providerService.getProviders({
      limit,
      offset,
      search,
      showActiveOnly: showActiveOnly === 'true',
    });
  }

  //Get a provider by id
  @Get(':id')
  getProviderById(@Param('id') id: string) {
    return this.providerService.getProviderById(id);
  }

  //Update a provider
  @Patch(':id')
  updateProvider(
    @Param('id') id: string,
    @Body() updateProviderDto: UpdateProviderDto,
  ) {
    return this.providerService.updateProvider(id, updateProviderDto);
  }

  //Delete a provider
  @Delete(':id')
  deleteProvider(@Param('id') id: string) {
    return this.providerService.deleteProvider(id);
  }
}
