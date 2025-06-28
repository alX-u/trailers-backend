import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  createContact(@Body() createContactDto: CreateContactDto) {
    return this.contactsService.createContact(createContactDto);
  }

  @Get()
  getAllContacts(
    @Query('search') search?: string,
    @Query('showActiveOnly') showActiveOnly?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.contactsService.getAllContacts(
      search,
      showActiveOnly === 'true',
      limit,
      offset,
    );
  }

  @Get(':id')
  getContactsByClient(@Param('id', ParseUUIDPipe) id: string) {
    return this.contactsService.getContactsByClient(id);
  }

  @Patch(':id')
  updateContact(
    @Param('id') id: string,
    @Body() updateContactDto: UpdateContactDto,
  ) {
    return this.contactsService.updateContact(id, updateContactDto);
  }

  @Delete(':id')
  softDeleteContact(@Param('id') id: string) {
    return this.contactsService.softDeleteContact(id);
  }
}
