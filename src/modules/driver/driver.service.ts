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

  async getAllDrivers() {
    return await this.driverRepository.find({
      where: { active: true },
      relations: ['document'],
    });
  }

  async getDriverById(id: string) {
    const driver = await this.driverRepository.findOne({
      where: { idDriver: id, active: true },
      relations: ['document'],
    });
    if (!driver) {
      throw new NotFoundException(`Driver with id ${id} not found`);
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
    });
    if (!driver) {
      throw new NotFoundException(
        `Driver with id ${id} not found or already inactive`,
      );
    }
    driver.active = false;
    await this.driverRepository.save(driver);
    return {
      message: `Driver #${id} has been soft deleted (set to inactive).`,
    };
  }
}
