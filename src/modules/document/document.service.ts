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

    // Check if a document with the same documentNumber already exists
    const existingDocument = await this.documentRepository.findOneBy({
      documentNumber,
    });
    if (existingDocument) {
      throw new NotFoundException(
        `Ya existe un usuario con el número de documento: ${documentNumber}`,
      );
    }

    // Find the DocumentType by UUID
    const docType = await this.documentTypeRepository.findOneBy({
      idDocumentType: documentType,
    });
    if (!docType) {
      throw new NotFoundException(
        `No se encontró un tipo de documento con el id ${documentType}`,
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

    if (updateDocumentDto.active !== undefined) {
      document.active = updateDocumentDto.active;
    }

    return await this.documentRepository.save(document);
  }

  async softDeleteDocument(id: string): Promise<{ message: string }> {
    const document = await this.documentRepository.findOne({
      where: { idDocument: id },
    });

    if (!document) {
      throw new NotFoundException(
        `Document with id ${id} not found or already deleted`,
      );
    }

    document.active = false;
    await this.documentRepository.save(document);

    return {
      message: `Document with id ${id} has been soft deleted (set to inactive).`,
    };
  }
}
