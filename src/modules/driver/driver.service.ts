import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Driver } from './entities/driver.entity';
import { Repository } from 'typeorm';
import { DocumentService } from '../document/document.service';

@Injectable()
export class DriverService {
  constructor(
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
    private readonly documentService: DocumentService,
  ) {}
  async createDriver(createDriverDto: CreateDriverDto) {
    const { documentType, documentNumber, ...driverDetails } = createDriverDto;

    // Create the document using DocumentService
    const document = await this.documentService.createDocument({
      documentType,
      documentNumber,
    });

    // Create and save the driver
    const driver = this.driverRepository.create({
      ...driverDetails,
      document: document,
    });

    return await this.driverRepository.save(driver);
  }

  async getAllDrivers({
    search,
    showActiveOnly,
    limit,
    offset,
  }: {
    search?: string;
    showActiveOnly?: boolean;
    limit?: number;
    offset?: number;
  } = {}): Promise<{
    data: Driver[];
    total: number;
    limit: number;
    offset: number;
  }> {
    const take = limit ?? 10;
    const skip = offset ?? 0;

    const queryBuilder = this.driverRepository
      .createQueryBuilder('driver')
      .leftJoinAndSelect('driver.document', 'document')
      .leftJoinAndSelect('document.documentType', 'documentType')
      .orderBy('driver.createdAt', 'DESC')
      .take(take)
      .skip(skip);

    // Filtro de activos
    if (showActiveOnly !== false) {
      queryBuilder.andWhere('driver.active = :active', { active: true });
    }

    // Filtro de búsqueda
    if (search) {
      queryBuilder.andWhere(
        `(LOWER(driver.firstName) LIKE :search OR LOWER(driver.lastName) LIKE :search OR LOWER(driver.phoneNumber) LIKE :search OR LOWER(document.documentNumber) LIKE :search)`,
        { search: `%${search.toLowerCase()}%` },
      );
    }

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total, limit: take, offset: skip };
  }

  async getDriverById(id: string) {
    const driver = await this.driverRepository.findOne({
      where: { idDriver: id, active: true },
      relations: ['document', 'document.documentType'],
    });
    if (!driver) {
      throw new NotFoundException(`Driver with id ${id} not found`);
    }
    return driver;
  }

  async getDriverByDocumentNumber(documentNumber: string) {
    const driver = await this.driverRepository.findOne({
      where: { document: { documentNumber }, active: true },
      relations: ['document', 'document.documentType'],
    });
    if (!driver) {
      throw new NotFoundException(
        `Driver with document number ${documentNumber} not found`,
      );
    }
    return driver;
  }

  async updateDriver(id: string, updateDriverDto: UpdateDriverDto) {
    const driver = await this.driverRepository.findOne({
      where: { idDriver: id, active: true },
      relations: ['document'],
    });
    if (!driver) {
      throw new NotFoundException(`Driver with id ${id} not found`);
    }

    // Update driver fields
    if (updateDriverDto.firstName !== undefined)
      driver.firstName = updateDriverDto.firstName;
    if (updateDriverDto.lastName !== undefined)
      driver.lastName = updateDriverDto.lastName;
    if (updateDriverDto.phoneNumber !== undefined)
      driver.phoneNumber = updateDriverDto.phoneNumber;
    if (updateDriverDto.active !== undefined)
      driver.active = updateDriverDto.active;

    // If document fields are present, update the document via DocumentService
    if (
      updateDriverDto.documentType !== undefined ||
      updateDriverDto.documentNumber !== undefined
    ) {
      await this.documentService.updateDocument(driver.document.idDocument, {
        documentType:
          updateDriverDto.documentType ??
          driver.document.documentType.idDocumentType,
        documentNumber:
          updateDriverDto.documentNumber ?? driver.document.documentNumber,
      });
    }

    return await this.driverRepository.save(driver);
  }

  async softDeleteDriver(id: string) {
    const driver = await this.driverRepository.findOne({
      where: { idDriver: id, active: true },
      relations: ['document'],
    });
    if (!driver) {
      throw new NotFoundException(
        `Driver with id ${id} not found or already inactive`,
      );
    }
    driver.active = false;
    await this.driverRepository.save(driver);

    // Soft delete the related document if exists
    if (driver.document && driver.document.idDocument) {
      await this.documentService.softDeleteDocument(driver.document.idDocument);
    }

    return {
      message: `Driver #${id} and its document have been soft deleted (set to inactive).`,
    };
  }
}
