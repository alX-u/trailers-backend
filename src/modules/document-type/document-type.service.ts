import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentType } from './entities/document-type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DocumentTypeService {
  constructor(
    @InjectRepository(DocumentType)
    private readonly documentTypeRepository: Repository<DocumentType>,
  ) {}
  async getAllDocumentTypes() {
    return await this.documentTypeRepository.find();
  }
}
