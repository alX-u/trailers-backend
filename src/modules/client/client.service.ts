import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { EntityManager, Repository } from 'typeorm';
import { DocumentType } from '../document-type/entities/document-type.entity';
import { DocumentService } from '../document/document.service';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(DocumentType)
    private readonly documentTypeRepository: Repository<DocumentType>,
    private readonly documentService: DocumentService,
  ) {}

  async createClient(
    createClientDto: CreateClientDto,
    manager?: EntityManager,
  ): Promise<Client> {
    const { documentType, documentNumber, ...clientDetails } = createClientDto;

    // Find the DocumentType entity
    const documentTypeRepo = manager
      ? manager.getRepository(DocumentType)
      : this.documentTypeRepository;
    const clientRepo = manager
      ? manager.getRepository(Client)
      : this.clientRepository;

    const selectedDocumentType = await documentTypeRepo.findOneBy({
      idDocumentType: documentType,
    });

    if (!selectedDocumentType) {
      throw new BadRequestException(
        `DocumentType with ID ${documentType} not found`,
      );
    }

    // Create a new client
    const client = clientRepo.create({
      ...clientDetails,
      document: {
        documentType: selectedDocumentType,
        documentNumber: documentNumber,
      },
    });

    // Save the client entity to the database
    return await clientRepo.save(client);
  }

  async getClientsPaginated({
    limit,
    offset,
    search,
    showActiveOnly,
  }: {
    limit?: number;
    offset?: number;
    search?: string;
    showActiveOnly?: boolean;
  }) {
    const take = limit ?? 10;
    const skip = offset ?? 0;

    try {
      const queryBuilder = this.clientRepository
        .createQueryBuilder('client')
        .leftJoinAndSelect('client.document', 'document')
        .leftJoinAndSelect('document.documentType', 'documentType')
        .orderBy('client.createdAt', 'DESC')
        .take(take)
        .skip(skip);

      // Filtro de activos
      if (showActiveOnly !== false) {
        queryBuilder.andWhere('client.active = :active', { active: true });
      }

      // Filtro de búsqueda por nombre o número de documento
      if (search) {
        queryBuilder.andWhere(
          `(LOWER(client.name) LIKE :search OR LOWER(document.documentNumber) LIKE :search)`,
          { search: `%${search.toLowerCase()}%` },
        );
      }

      const [clients, total] = await queryBuilder.getManyAndCount();

      return {
        data: clients,
        total,
        limit: take,
        offset: skip,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async getClientById(id: string): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: { idClient: id },
      relations: ['document', 'document.documentType'],
    });

    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    return client;
  }

  async getClientByDocumentNumber(documentNumber: string) {
    return await this.clientRepository
      .findOne({
        where: { document: { documentNumber } },
        relations: ['document', 'document.documentType'],
      })
      .then((client) => {
        if (!client) {
          throw new NotFoundException(
            `Client with document number ${documentNumber} not found`,
          );
        }
        return client;
      });
  }

  async updateClient(
    id: string,
    updateClientDto: UpdateClientDto,
    manager?: EntityManager,
  ): Promise<Client> {
    const repo = manager
      ? manager.getRepository(Client)
      : this.clientRepository;
    const documentTypeRepo = manager
      ? manager.getRepository(DocumentType)
      : this.documentTypeRepository;

    // Find the existing client
    const client = await repo.findOne({
      where: { idClient: id },
      relations: ['document'],
    });

    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    // If updating documentType or documentNumber, handle the relation
    if (updateClientDto.documentType || updateClientDto.documentNumber) {
      if (!client.document) {
        client.document = {} as any;
      }
      if (updateClientDto.documentType) {
        const selectedDocumentType = await documentTypeRepo.findOneBy({
          idDocumentType: updateClientDto.documentType,
        });
        if (!selectedDocumentType) {
          throw new BadRequestException(
            `DocumentType with ID ${updateClientDto.documentType} not found`,
          );
        }
        client.document.documentType = selectedDocumentType;
      }
      if (updateClientDto.documentNumber) {
        client.document.documentNumber = updateClientDto.documentNumber;
      }
    }

    // Merge other updatable fields
    if (updateClientDto.name) {
      client.name = updateClientDto.name;
    }

    // Save the updated client
    return await repo.save(client);
  }

  async softDeleteClient(id: string) {
    // Find the existing client
    const client = await this.clientRepository.findOne({
      where: { idClient: id },
      relations: ['document'],
    });

    if (!client) {
      throw new NotFoundException(`Client with id ${id} not found`);
    }

    // Soft delete the client
    client.active = false;
    await this.clientRepository.save(client);

    // Soft delete the related document if exists
    if (client.document && client.document.idDocument) {
      await this.documentService.softDeleteDocument(client.document.idDocument);
    }

    return {
      message: `Client with id ${id} and its document have been soft deleted.`,
    };
  }
}
