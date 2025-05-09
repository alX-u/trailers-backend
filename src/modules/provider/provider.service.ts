import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Provider } from './entities/provider.entity';
import { Repository } from 'typeorm';
import { DocumentType } from '../document-type/entities/document-type.entity';
import { Document } from '../document/entities/document.entity';

@Injectable()
export class ProviderService {
  constructor(
    @InjectRepository(Provider)
    private readonly providerRepository: Repository<Provider>,
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    @InjectRepository(DocumentType)
    private readonly documentTypeRepository: Repository<DocumentType>,
  ) {}
  async createProvider(createProviderDto: CreateProviderDto) {
    try {
      const { documentNumber, documentType, ...providerDetails } =
        createProviderDto;

      // Find the DocumentType entity
      const selectedDocumentType = await this.documentTypeRepository.findOneBy({
        idDocumentType: documentType,
      });

      if (!selectedDocumentType) {
        throw new BadRequestException(
          `DocumentType with ID ${documentType} not found`,
        );
      }

      //Create provider
      const provider = this.providerRepository.create({
        ...providerDetails,
        document: {
          documentType: selectedDocumentType,
          documentNumber: documentNumber,
        },
      });

      return await this.providerRepository.save(provider);
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException('Provider already exists');
      }
      throw new InternalServerErrorException('Failed to create provider');
    }
  }
  async getProviders({ limit, offset }: { limit?: number; offset?: number }) {
    const take = limit ?? 10;
    const skip = offset ?? 0;

    try {
      const [providers, total] = await this.providerRepository.findAndCount({
        take,
        skip,
        order: { createdAt: 'DESC' },
        relations: ['document', 'document.documentType'],
      });

      return {
        data: providers,
        total,
        limit: take,
        offset: skip,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch providers');
    }
  }

  async getProviderById(id: string) {
    try {
      const provider = await this.providerRepository.findOne({
        where: { idProvider: id },
        relations: ['document', 'document.documentType'],
      });

      if (!provider) {
        throw new NotFoundException(`Provider with ID ${id} not found`);
      }

      return provider;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch provider');
    }
  }

  async updateProvider(id: string, updateProviderDto: UpdateProviderDto) {
    try {
      // Find the existing provider with its document and documentType
      const provider = await this.providerRepository.findOne({
        where: { idProvider: id },
        relations: ['document', 'document.documentType'],
      });

      if (!provider) {
        throw new NotFoundException(`Provider with ID ${id} not found`);
      }

      // Update scalar fields if provided
      if (updateProviderDto.name !== undefined)
        provider.name = updateProviderDto.name;
      if (updateProviderDto.email !== undefined)
        provider.email = updateProviderDto.email;
      if (updateProviderDto.phoneNumber !== undefined)
        provider.phoneNumber = updateProviderDto.phoneNumber;

      // Update document and documentType if provided
      if (
        updateProviderDto.documentNumber !== undefined ||
        updateProviderDto.documentType !== undefined
      ) {
        let document = provider.document;

        // If provider doesn't have a document, create one
        if (!document) {
          document = this.documentRepository.create();
        }

        // Update documentNumber if provided
        if (updateProviderDto.documentNumber !== undefined) {
          document.documentNumber = updateProviderDto.documentNumber;
        }

        // Update documentType if provided
        if (updateProviderDto.documentType !== undefined) {
          const selectedDocumentType =
            await this.documentTypeRepository.findOneBy({
              idDocumentType: updateProviderDto.documentType,
            });
          if (!selectedDocumentType) {
            throw new BadRequestException(
              `DocumentType with ID ${updateProviderDto.documentType} not found`,
            );
          }
          document.documentType = selectedDocumentType;
        }

        provider.document = document;
      }

      // Save the updated provider (cascades to document if needed)
      const updatedProvider = await this.providerRepository.save(provider);

      return updatedProvider;
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException('Provider already exists');
      }
      throw new InternalServerErrorException('Failed to update provider');
    }
  }

  async deleteProvider(id: string) {
    try {
      const provider = await this.providerRepository.findOne({
        where: { idProvider: id },
        relations: ['document', 'document.documentType'],
      });

      if (!provider) {
        throw new NotFoundException(`Provider with ID ${id} not found`);
      }

      await this.providerRepository.remove(provider);

      return {
        message: `Provider with ID ${id} has been deleted successfully.`,
        provider,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete provider');
    }
  }
}
