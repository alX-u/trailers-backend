import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentType } from 'src/modules/document-type/entities/document-type.entity';
import { Role } from 'src/modules/role/entities/role.entity';
import { UserStatus } from 'src/modules/user-status/entities/user-status.entity';
import { ServiceType } from 'src/modules/service-type/entities/service-type.entity';
import { OrderStatus } from 'src/modules/order-status/entities/order-status.entity';
import { VehiculeType } from 'src/modules/vehicule-type/entities/vehicule-type.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(DocumentType)
    private readonly documentTypeRepository: Repository<DocumentType>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(UserStatus)
    private readonly userStatusRepository: Repository<UserStatus>,
    @InjectRepository(ServiceType)
    private readonly serviceTypeRepository: Repository<ServiceType>,
    @InjectRepository(OrderStatus)
    private readonly orderStatusRepository: Repository<OrderStatus>,
    @InjectRepository(VehiculeType)
    private readonly vehiculeTypeRepository: Repository<VehiculeType>,
  ) {}

  async seed() {
    await this.createDocumentTypes();
    await this.createRoles();
    await this.createUserStatuses();
    await this.createServiceTypes();
    await this.createOrderStatuses();
    await this.createVehiculeTypes();

    return { message: 'Seed completed' };
  }

  private async createDocumentTypes() {
    // Seed DocumentType
    const documentTypes = [
      { name: 'Cédula de Ciudadanía', abbreviation: 'CC' },
      { name: 'Tarjeta de Identidad', abbreviation: 'TI' },
      { name: 'Cédula de Extranjería', abbreviation: 'CE' },
      { name: 'Permiso Especial de Permanencia', abbreviation: 'PEP' },
      { name: 'Pasaporte', abbreviation: 'PAS' },
      { name: 'Número de Identificación Tributaria', abbreviation: 'NIT' },
      { name: 'Número Único de Identificación Personal', abbreviation: 'NUIP' },
      { name: 'Registro Civil', abbreviation: 'RC' },
    ];
    for (const docType of documentTypes) {
      const exists = await this.documentTypeRepository.findOne({
        where: { name: docType.name },
      });
      if (!exists) {
        await this.documentTypeRepository.save(docType);
      }
    }
  }

  private async createRoles() {
    // Seed Role
    const roles = [
      { name: 'Administrador' },
      { name: 'Usuario' },
      { name: 'Contratista' },
    ];
    for (const role of roles) {
      const exists = await this.roleRepository.findOne({
        where: { name: role.name },
      });
      if (!exists) {
        await this.roleRepository.save(role);
      }
    }
  }

  private async createUserStatuses() {
    // Seed UserStatus
    const userStatuses = [
      { name: 'Activo' },
      { name: 'Inactivo' },
      { name: 'Pendiente' },
    ];
    for (const status of userStatuses) {
      const exists = await this.userStatusRepository.findOne({
        where: { name: status.name },
      });
      if (!exists) {
        await this.userStatusRepository.save(status);
      }
    }
  }

  private async createServiceTypes() {
    const serviceTypes = [
      { name: 'Mantenimiento' },
      { name: 'Reparación' },
      { name: 'Piezas/Repuestos' },
      { name: 'Fabricación' },
    ];

    for (const serviceType of serviceTypes) {
      const exists = await this.serviceTypeRepository.findOne({
        where: { name: serviceType.name },
      });

      if (!exists) {
        await this.serviceTypeRepository.save(serviceType);
      }
    }
  }

  private async createOrderStatuses() {
    const orderStatuses = [
      { name: 'Trabajo por Realizar' },
      { name: 'Pendiente Cotización' },
      { name: 'Cotización Elaborada' },
      { name: 'Cotización Enviada' },
      { name: 'Trabajo Realizado' },
      { name: 'Facturado' },
    ];

    for (const orderStatus of orderStatuses) {
      const exists = await this.orderStatusRepository.findOne({
        where: { name: orderStatus.name },
      });

      if (!exists) {
        await this.orderStatusRepository.save(orderStatus);
      }
    }
  }

  private async createVehiculeTypes() {
    const vehiculeTypes = [
      { name: 'Cabezote' },
      { name: 'Tráiler ' },
      { name: 'Otro' },
    ];

    for (const vehiculeType of vehiculeTypes) {
      const exists = await this.vehiculeTypeRepository.findOne({
        where: { name: vehiculeType.name },
      });

      if (!exists) {
        await this.vehiculeTypeRepository.save(vehiculeType);
      }
    }
  }
}
