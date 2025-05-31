import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  createClient(@Body() createClientDto: CreateClientDto) {
    return this.clientService.createClient(createClientDto);
  }

  @Get()
  getClientsPaginated(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.clientService.getClientsPaginated({ limit, offset });
  }

  @Get(':id')
  findClientById(@Param('id', ParseUUIDPipe) id: string) {
    return this.clientService.getClientById(id);
  }

  @Get('document/:documentNumber')
  findClientByDocumentNumber(@Param('documentNumber') documentNumber: string) {
    return this.clientService.getClientByDocumentNumber(documentNumber);
  }

  @Patch(':id')
  updateClient(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return this.clientService.updateClient(id, updateClientDto);
  }

  @Delete(':id')
  softDeleteClient(@Param('id', ParseUUIDPipe) id: string) {
    return this.clientService.softDeleteClient(id);
  }
}
