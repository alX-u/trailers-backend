import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentType } from '../document-type/entities/document-type.entity';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    @InjectRepository(DocumentType)
    private readonly documentTypeRepository: Repository<DocumentType>,
  ) {}
  async createDocument(
    createDocumentDto: CreateDocumentDto,
  ): Promise<Document> {
    const { documentType, documentNumber } = createDocumentDto;

    // Find the DocumentType by UUID
    const docType = await this.documentTypeRepository.findOneBy({
      idDocumentType: documentType,
    });
    if (!docType) {
      throw new NotFoundException(
        `DocumentType with id ${documentType} not found`,
      );
    }

    // Create and save the new Document
    const document = this.documentRepository.create({
      documentType: docType,
      documentNumber,
    });
    return await this.documentRepository.save(document);
  }

  async updateDocument(
    id: string,
    updateDocumentDto: UpdateDocumentDto,
  ): Promise<Document> {
    const document = await this.documentRepository.findOne({
      where: { idDocument: id },
      relations: ['documentType'],
    });
    if (!document) {
      throw new NotFoundException(`Document with id ${id} not found`);
    }

    // If documentType is being updated, validate it exists
    if (updateDocumentDto.documentType) {
      const docType = await this.documentTypeRepository.findOneBy({
        idDocumentType: updateDocumentDto.documentType,
      });
      if (!docType) {
        throw new NotFoundException(
          `DocumentType with id ${updateDocumentDto.documentType} not found`,
        );
      }
      document.documentType = docType;
    }

    if (updateDocumentDto.documentNumber !== undefined) {
      document.documentNumber = updateDocumentDto.documentNumber;
    }

    return await this.documentRepository.save(document);
  }

  async deleteDocument(id: string): Promise<{ message: string }> {
    try {
      await this.documentRepository.delete({ idDocument: id });
      return { message: `Document with id ${id} deleted successfully` };
    } catch (error) {
      console.log(error);
      throw new NotFoundException(
        `Document with id ${id} not found or already deleted`,
      );
    }
  }
}
