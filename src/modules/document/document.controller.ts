import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post()
  createDocument(@Body() createDocumentDto: CreateDocumentDto) {
    return this.documentService.createDocument(createDocumentDto);
  }

  @Patch(':id')
  updateDocument(
    @Param('id') id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ) {
    return this.documentService.updateDocument(id, updateDocumentDto);
  }

  @Delete(':id')
  softDeleteDocument(@Param('id') id: string) {
    return this.documentService.softDeleteDocument(id);
  }
}
