import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { ClientService } from '../client/client.service';
import { VehiculeService } from '../vehicule/vehicule.service';
import { PricingService } from '../pricing/pricing.service';
import { SparePartMaterialService } from '../spare-part-material/spare-part-material.service';
import { ManpowerService } from '../manpower/manpower.service';
import { OrderStatus } from '../order-status/entities/order-status.entity';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ServiceTypeService } from '../service-type/service-type.service';
import { OrderSparePartMaterial } from './entities/order-spare-part-material.entity';
import { OrderManpower } from './entities/order-manpower.entity';
import { BillingService } from '../billing/billing.service';
import { UserService } from '../user/user.service';
import { DriverService } from '../driver/driver.service';
import { ProviderService } from '../provider/provider.service';
import { OrderManpowerSupply } from './entities/order-manpower-supply.entity';
import { SupplyService } from '../supply/supply.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderStatus)
    private readonly orderStatusRepository: Repository<OrderStatus>,
    private readonly clientService: ClientService,
    private readonly vehiculeService: VehiculeService,
    private readonly pricingService: PricingService,
    private readonly sparePartMaterialService: SparePartMaterialService,
    private readonly manpowerService: ManpowerService,
    private readonly serviceTypeService: ServiceTypeService,
    private readonly billingService: BillingService,
    private readonly userService: UserService,
    private readonly driverService: DriverService,
    private readonly providerService: ProviderService,
    private readonly supplyService: SupplyService,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    const connection = this.orderRepository.manager.connection;
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    let transactionStarted = false;

    try {
      await queryRunner.startTransaction();
      transactionStarted = true;

      // Buscar entidades relacionadas solo si vienen en el DTO
      let client = null;
      if (createOrderDto.client) {
        client = await this.clientService.getClientById(createOrderDto.client);
        if (!client)
          throw new NotFoundException(
            `Client with id ${createOrderDto.client} not found`,
          );
      }

      let vehicule = null;
      if (createOrderDto.vehicule) {
        vehicule = await this.vehiculeService.getVehiculeById(
          createOrderDto.vehicule,
        );
        if (!vehicule)
          throw new NotFoundException(
            `Vehicule with id ${createOrderDto.vehicule} not found`,
          );
      }

      let orderStatus = null;
      if (createOrderDto.orderStatus) {
        orderStatus = await queryRunner.manager.findOne(OrderStatus, {
          where: { idOrderStatus: createOrderDto.orderStatus },
        });
        if (!orderStatus)
          throw new NotFoundException(
            `OrderStatus with id ${createOrderDto.orderStatus} not found`,
          );
      }

      let assignedDriver = null;
      if (createOrderDto.assignedDriver) {
        assignedDriver = await this.driverService.getDriverById(
          createOrderDto.assignedDriver,
        );
        if (!assignedDriver)
          throw new NotFoundException(
            `Driver with id ${createOrderDto.assignedDriver} not found`,
          );
      }

      let assignTo = null;
      if (
        createOrderDto.assignTo &&
        Array.isArray(createOrderDto.assignTo) &&
        createOrderDto.assignTo.length > 0
      ) {
        assignTo = await Promise.all(
          createOrderDto.assignTo.map(async (userId) => {
            const user = await this.userService.getUserById(userId);
            if (!user) {
              throw new NotFoundException(`User with id ${userId} not found`);
            }
            // Opcional: validar roles permitidos
            const validRoles = ['Mecánico', 'Colaborador', 'Contratista'];
            if (!validRoles.includes(user.role.name)) {
              throw new NotFoundException(
                `User with id ${userId} does not have a valid role (Mecánico, Colaborador, Contratista)`,
              );
            }
            return user;
          }),
        );
      }

      let serviceTypes = [];
      if (
        createOrderDto.serviceTypes &&
        createOrderDto.serviceTypes.length > 0
      ) {
        serviceTypes = await Promise.all(
          createOrderDto.serviceTypes.map(async (id) => {
            const st = await this.serviceTypeService.getServiceTypeById(id);
            if (!st)
              throw new NotFoundException(
                `ServiceType with id ${id} not found`,
              );
            return st;
          }),
        );
      }

      let pricings = [];
      if (createOrderDto.pricings && createOrderDto.pricings.length > 0) {
        pricings = await Promise.all(
          createOrderDto.pricings.map(async (pricingDto) => {
            const dto = {
              ...pricingDto,
              pricingDate: new Date(pricingDto.pricingDate),
            };
            return await this.pricingService.createPricing(
              dto,
              queryRunner.manager,
            );
          }),
        );
      }

      let billings = [];
      if (createOrderDto.billings && createOrderDto.billings.length > 0) {
        billings = await Promise.all(
          createOrderDto.billings.map(async (billingDto) => {
            const dto = {
              ...billingDto,
              billingDate: new Date(billingDto.billingDate),
            };
            return await this.billingService.createBilling(
              dto,
              queryRunner.manager,
            );
          }),
        );
      }

      let sparePartMaterials = [];
      if (
        createOrderDto.sparePartMaterials &&
        createOrderDto.sparePartMaterials.length > 0
      ) {
        sparePartMaterials = await Promise.all(
          createOrderDto.sparePartMaterials.map(async (spmDto) => {
            const spmEntity =
              await this.sparePartMaterialService.getSparepartMaterialById(
                spmDto.sparePartMaterial,
              );
            if (!spmEntity)
              throw new NotFoundException(
                `SparePartMaterial with id ${spmDto.sparePartMaterial} not found`,
              );

            let selectedProvider = null;
            if (spmDto.selectedProvider) {
              selectedProvider = await this.providerService.getProviderById(
                spmDto.selectedProvider,
              );
              if (!selectedProvider)
                throw new NotFoundException(
                  `Provider with id ${spmDto.selectedProvider} not found`,
                );
            }

            return queryRunner.manager.create(OrderSparePartMaterial, {
              sparePartMaterial: spmEntity,
              selectedProvider,
              cantidad: spmDto.cantidad ?? null,
              costoTotal: spmDto.costoTotal ?? null,
              factorVenta: spmDto.factorVenta ?? null,
              ventaUnitaria: spmDto.ventaUnitaria ?? null,
              ventaTotal: spmDto.ventaTotal ?? null,
            });
          }),
        );
      }

      let manpowers = [];
      if (createOrderDto.manpowers && createOrderDto.manpowers.length > 0) {
        manpowers = await Promise.all(
          createOrderDto.manpowers.map(async (mpDto) => {
            const mpEntity = await this.manpowerService.getManpowerById(
              mpDto.manpower,
            );
            if (!mpEntity)
              throw new NotFoundException(
                `Manpower with id ${mpDto.manpower} not found`,
              );

            // Buscar selectedContractor si viene
            let selectedContractor = null;
            if (mpDto.selectedContractor) {
              selectedContractor = await this.userService.getUserById(
                mpDto.selectedContractor,
              );
              if (!selectedContractor)
                throw new NotFoundException(
                  `User (contractor) with id ${mpDto.selectedContractor} not found`,
                );
            }

            // Crea el OrderManpower sin supplies aún
            const orderManpower = queryRunner.manager.create(OrderManpower, {
              manpower: mpEntity,
              selectedContractor,
              unitaryCost: mpDto.unitaryCost ?? null,
              useDetail: mpDto.useDetail ?? null,
              cantidad: mpDto.cantidad ?? null,
              costoTotal: mpDto.costoTotal ?? null,
              factorVenta: mpDto.factorVenta ?? null,
              ventaUnitaria: mpDto.ventaUnitaria ?? null,
              ventaTotal: mpDto.ventaTotal ?? null,
              supplies: [],
            });

            // Procesar supplies si existen
            if (
              mpDto.supplies &&
              Array.isArray(mpDto.supplies) &&
              mpDto.supplies.length > 0
            ) {
              orderManpower.supplies = await Promise.all(
                mpDto.supplies.map(async (supplyDto) => {
                  const supplyEntity = await this.supplyService.findOne(
                    supplyDto.supply,
                  );
                  if (!supplyEntity)
                    throw new NotFoundException(
                      `Supply with id ${supplyDto.supply} not found`,
                    );

                  // Buscar selectedProvider si viene
                  let selectedProvider = null;
                  if (supplyDto.selectedProvider) {
                    selectedProvider =
                      await this.providerService.getProviderById(
                        supplyDto.selectedProvider,
                      );
                    if (!selectedProvider)
                      throw new NotFoundException(
                        `Provider with id ${supplyDto.selectedProvider} not found`,
                      );
                  }
                  return queryRunner.manager.create(OrderManpowerSupply, {
                    supply: supplyEntity,
                    selectedProvider,
                    unitaryCost: supplyDto.unitaryCost ?? null,
                    cantidad: supplyDto.cantidad ?? null,
                    costoTotal: supplyDto.costoTotal ?? null,
                  });
                }),
              );
            }

            return orderManpower;
          }),
        );
      }

      console.dir(manpowers, { depth: null });

      const order = queryRunner.manager.create(Order, {
        outDate: createOrderDto.outDate
          ? new Date(createOrderDto.outDate)
          : null,
        orderStatus: orderStatus ?? null,
        serviceTypes: serviceTypes.length > 0 ? serviceTypes : null,
        client: client ?? null,
        assignTo: assignTo ?? null,
        vehicule: vehicule ?? null,
        kilometers: createOrderDto.kilometers ?? null,
        assignedDriver: assignedDriver ?? null,
        pricings: pricings.length > 0 ? pricings : null,
        billings: billings.length > 0 ? billings : null,
        sparePartMaterials:
          sparePartMaterials.length > 0 ? sparePartMaterials : null,
        manpowers: manpowers.length > 0 ? manpowers : null,
        total: createOrderDto.totals ?? null,
        active: true,
      });

      const savedOrder = await queryRunner.manager.save(Order, order);

      await queryRunner.commitTransaction();
      transactionStarted = false;
      return savedOrder;
    } catch (error) {
      if (transactionStarted) {
        await queryRunner.rollbackTransaction();
      }
      console.error(error);
      throw new InternalServerErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async getAllOrdersPaginated({
    limit,
    offset,
    userId,
  }: {
    limit?: number;
    offset?: number;
    userId?: string;
  }) {
    const take = limit ?? 10;
    const skip = offset ?? 0;

    let whereClause: any = { active: true };

    // Si viene userId, filtra por rol
    if (userId) {
      const user = await this.userService.getUserById(userId);
      if (
        user &&
        ['Colaborador', 'Mecánico', 'Contratista'].includes(user.role.name)
      ) {
        whereClause = {
          ...whereClause,
          assignTo: { idUser: userId },
        };
      }
    }

    const [orders, total] = await this.orderRepository.findAndCount({
      where: whereClause,
      relations: [
        'assignTo',
        'assignTo.role',
        'client',
        'client.document',
        'client.document.documentType',
        'vehicule',
        'vehicule.vehiculeType',
        'assignedDriver',
        'assignedDriver.document',
        'assignedDriver.document.documentType',
        'orderStatus',
        'pricings',
        'pricings.pricedBy',
        'sparePartMaterials',
        'sparePartMaterials.sparePartMaterial.providers',
        'sparePartMaterials.selectedProvider',
        'sparePartMaterials.selectedProvider.document',
        'sparePartMaterials.selectedProvider.document.documentType',
        'manpowers',
        'manpowers.manpower',
        'manpowers.manpower.contractors',
        'manpowers.manpower.contractors.document',
        'manpowers.manpower.contractors.document.documentType',
        'manpowers.selectedContractor',
        'manpowers.selectedContractor.document',
        'manpowers.selectedContractor.document.documentType',
        'manpowers.supplies',
        'manpowers.supplies.supply',
        'manpowers.supplies.supply.providers',
        'manpowers.supplies.selectedProvider',
        'manpowers.supplies.selectedProvider.document',
        'manpowers.supplies.selectedProvider.document.documentType',
        'billings',
        'billings.billedBy',
        'serviceTypes',
      ],
      take,
      skip,
      order: { createdAt: 'DESC' },
    });

    return { data: orders, total, limit: take, offset: skip };
  }

  async findOrderById(id: string) {
    try {
      const order = await this.orderRepository.findOne({
        where: { idOrder: id, active: true },
        relations: [
          'assignTo',
          'assignTo.role',
          'client',
          'client.document',
          'client.document.documentType',
          'vehicule',
          'vehicule.vehiculeType',
          'assignedDriver',
          'assignedDriver.document',
          'assignedDriver.document.documentType',
          'orderStatus',
          'pricings',
          'pricings.pricedBy',
          'sparePartMaterials',
          'sparePartMaterials.sparePartMaterial.providers',
          'sparePartMaterials.selectedProvider',
          'sparePartMaterials.selectedProvider.document',
          'sparePartMaterials.selectedProvider.document.documentType',
          'manpowers',
          'manpowers.manpower',
          'manpowers.manpower.contractors',
          'manpowers.manpower.contractors.document',
          'manpowers.manpower.contractors.document.documentType',
          'manpowers.selectedContractor',
          'manpowers.selectedContractor.document',
          'manpowers.selectedContractor.document.documentType',
          'manpowers.supplies',
          'manpowers.supplies.supply',
          'manpowers.supplies.supply.providers',
          'manpowers.supplies.selectedProvider',
          'manpowers.supplies.selectedProvider.document',
          'manpowers.supplies.selectedProvider.document.documentType',
          'billings',
          'billings.billedBy',
          'serviceTypes',
        ],
      });

      if (!order) {
        throw new NotFoundException(`Order with id ${id} not found`);
      }

      return order;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Unexpected error while fetching order',
      );
    }
  }

  async updateOrder(id: string, updateOrderDto: UpdateOrderDto) {
    const connection = this.orderRepository.manager.connection;
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Buscar la orden existente
      const order = await queryRunner.manager.findOne(Order, {
        where: { idOrder: id, active: true },
        relations: [
          'client',
          'vehicule',
          'orderStatus',
          'pricings',
          'billings',
          'sparePartMaterials',
          'manpowers',
          'serviceTypes',
        ],
      });
      if (!order) {
        throw new NotFoundException(`Order with id ${id} not found`);
      }

      // 2. Actualizar campos simples (pueden ser null)
      if ('outDate' in updateOrderDto)
        order.outDate = updateOrderDto.outDate
          ? new Date(updateOrderDto.outDate)
          : null;
      if ('active' in updateOrderDto) order.active = updateOrderDto.active;
      if ('totals' in updateOrderDto)
        order.total = updateOrderDto.totals ?? null;
      if ('kilometers' in updateOrderDto) {
        order.kilometers = updateOrderDto.kilometers ?? null;
      }

      // 3. Actualizar estado de la orden (puede ser null)
      if ('orderStatus' in updateOrderDto) {
        if (updateOrderDto.orderStatus) {
          const orderStatus = await queryRunner.manager.findOne(OrderStatus, {
            where: { idOrderStatus: updateOrderDto.orderStatus },
          });
          if (!orderStatus)
            throw new NotFoundException(
              `OrderStatus with id ${updateOrderDto.orderStatus} not found`,
            );
          order.orderStatus = orderStatus;
        } else {
          order.orderStatus = null;
        }
      }

      if ('assignTo' in updateOrderDto) {
        if (updateOrderDto.assignTo && Array.isArray(updateOrderDto.assignTo)) {
          const assignTo = await Promise.all(
            updateOrderDto.assignTo.map(async (userId) => {
              const user = await this.userService.getUserById(userId);
              if (!user) {
                throw new NotFoundException(`User with id ${userId} not found`);
              }
              const validRoles = ['Mecánico', 'Colaborador', 'Contratista'];
              if (!validRoles.includes(user.role.name)) {
                throw new NotFoundException(
                  `User with id ${userId} does not have a valid role (Mecánico, Colaborador, Contratista)`,
                );
              }
              return user;
            }),
          );
          order.assignTo = assignTo;
        } else {
          order.assignTo = null;
        }
      }

      // 4. Actualizar cliente (puede ser null)
      if ('client' in updateOrderDto) {
        if (updateOrderDto.client) {
          const client = await this.clientService.getClientById(
            updateOrderDto.client,
          );
          if (!client) {
            throw new NotFoundException(
              `Client with id ${updateOrderDto.client} not found`,
            );
          }
          order.client = client;
        } else {
          order.client = null;
        }
      }

      // 5. Actualizar vehículo (puede ser null)
      if ('vehicule' in updateOrderDto) {
        if (updateOrderDto.vehicule) {
          const vehicule = await this.vehiculeService.getVehiculeById(
            updateOrderDto.vehicule,
          );
          if (!vehicule) {
            throw new NotFoundException(
              `Vehicule with id ${updateOrderDto.vehicule} not found`,
            );
          }
          order.vehicule = vehicule;
        } else {
          order.vehicule = null;
        }
      }

      if ('assignedDriver' in updateOrderDto) {
        if (updateOrderDto.assignedDriver) {
          const assignedDriver = await this.driverService.getDriverById(
            updateOrderDto.assignedDriver,
          );
          if (!assignedDriver) {
            throw new NotFoundException(
              `Driver with id ${updateOrderDto.assignedDriver} not found`,
            );
          }
          order.assignedDriver = assignedDriver;
        } else {
          order.assignedDriver = null;
        }
      }

      // 6. Actualizar pricings (puede ser null o array vacío)
      if ('pricings' in updateOrderDto) {
        if (updateOrderDto.pricings) {
          order.pricings = await Promise.all(
            updateOrderDto.pricings.map((pricingDto) => {
              const dto = {
                ...pricingDto,
                pricingDate: new Date(pricingDto.pricingDate),
              };
              return this.pricingService.createPricing(
                dto,
                queryRunner.manager,
              );
            }),
          );
        } else {
          order.pricings = null;
        }
      }

      // 6.5. Actualizar billings (puede ser null o array vacío)
      if ('billings' in updateOrderDto) {
        if (updateOrderDto.billings) {
          order.billings = await Promise.all(
            updateOrderDto.billings.map((billingDto) => {
              const dto = {
                ...billingDto,
                billingDate: new Date(billingDto.billingDate),
              };
              return this.billingService.createBilling(
                dto,
                queryRunner.manager,
              );
            }),
          );
        } else {
          order.billings = null;
        }
      }

      // 7. Actualizar sparePartMaterials (puede ser null o array vacío)
      if ('sparePartMaterials' in updateOrderDto) {
        await queryRunner.manager.delete(OrderSparePartMaterial, {
          order: { idOrder: id },
        });

        if (updateOrderDto.sparePartMaterials) {
          order.sparePartMaterials = await Promise.all(
            updateOrderDto.sparePartMaterials.map(async (spmDto) => {
              const spmEntity =
                await this.sparePartMaterialService.getSparepartMaterialById(
                  spmDto.sparePartMaterial,
                );
              if (!spmEntity)
                throw new NotFoundException(
                  `SparePartMaterial with id ${spmDto.sparePartMaterial} not found`,
                );

              let selectedProvider = null;
              if (spmDto.selectedProvider) {
                selectedProvider = await this.providerService.getProviderById(
                  spmDto.selectedProvider,
                );
                if (!selectedProvider)
                  throw new NotFoundException(
                    `Provider with id ${spmDto.selectedProvider} not found`,
                  );
              }

              return queryRunner.manager.create(OrderSparePartMaterial, {
                order,
                sparePartMaterial: spmEntity,
                selectedProvider,
                unitaryCost: spmDto.unitaryCost ?? null,
                cantidad: spmDto.cantidad ?? null,
                costoTotal: spmDto.costoTotal ?? null,
                factorVenta: spmDto.factorVenta ?? null,
                ventaUnitaria: spmDto.ventaUnitaria ?? null,
                ventaTotal: spmDto.ventaTotal ?? null,
              });
            }),
          );
        } else {
          order.sparePartMaterials = null;
        }
      }

      // 8. Actualizar manpowers (puede ser null o array vacío)
      if ('manpowers' in updateOrderDto) {
        // Elimina los manpowers y sus supplies anteriores
        await queryRunner.manager.delete(OrderManpower, {
          order: { idOrder: id },
        });

        if (updateOrderDto.manpowers && updateOrderDto.manpowers.length > 0) {
          // Primero crea los nuevos OrderManpower sin supplies
          const newManpowers = await Promise.all(
            updateOrderDto.manpowers.map(async (mpDto) => {
              const mpEntity = await this.manpowerService.getManpowerById(
                mpDto.manpower,
              );
              if (!mpEntity)
                throw new NotFoundException(
                  `Manpower with id ${mpDto.manpower} not found`,
                );

              // Buscar selectedContractor si viene
              let selectedContractor = null;
              if (mpDto.selectedContractor) {
                selectedContractor = await this.userService.getUserById(
                  mpDto.selectedContractor,
                );
                if (!selectedContractor)
                  throw new NotFoundException(
                    `User (contractor) with id ${mpDto.selectedContractor} not found`,
                  );
              }

              return queryRunner.manager.create(OrderManpower, {
                order,
                manpower: mpEntity,
                selectedContractor,
                unitaryCost: mpDto.unitaryCost ?? null,
                useDetail: mpDto.useDetail ?? null,
                cantidad: mpDto.cantidad ?? null,
                costoTotal: mpDto.costoTotal ?? null,
                factorVenta: mpDto.factorVenta ?? null,
                ventaUnitaria: mpDto.ventaUnitaria ?? null,
                ventaTotal: mpDto.ventaTotal ?? null,
                supplies: [],
              });
            }),
          );

          // Guarda los nuevos manpowers (sin supplies)
          const savedManpowers = await queryRunner.manager.save(
            OrderManpower,
            newManpowers,
          );

          // Ahora crea y guarda los supplies para cada manpower
          for (const orderManpower of savedManpowers) {
            const mpDto = updateOrderDto.manpowers.find(
              (mp) => mp.manpower === orderManpower.manpower.idManpower,
            );
            if (mpDto && mpDto.supplies && mpDto.supplies.length > 0) {
              const supplies = await Promise.all(
                mpDto.supplies.map(async (supplyDto) => {
                  const supplyEntity = await this.supplyService.findOne(
                    supplyDto.supply,
                  );
                  if (!supplyEntity)
                    throw new NotFoundException(
                      `Supply with id ${supplyDto.supply} not found`,
                    );

                  // Buscar selectedProvider si viene
                  let selectedProvider = null;
                  if (supplyDto.selectedProvider) {
                    selectedProvider =
                      await this.providerService.getProviderById(
                        supplyDto.selectedProvider,
                      );
                    if (!selectedProvider)
                      throw new NotFoundException(
                        `Provider with id ${supplyDto.selectedProvider} not found`,
                      );
                  }

                  return queryRunner.manager.create(OrderManpowerSupply, {
                    supply: supplyEntity,
                    selectedProvider,
                    unitaryCost: supplyDto.unitaryCost ?? null,
                    cantidad: supplyDto.cantidad ?? null,
                    costoTotal: supplyDto.costoTotal ?? null,
                  });
                }),
              );
              // Guarda los supplies y actualiza la relación en la base de datos
              await queryRunner.manager.save(OrderManpowerSupply, supplies);
              orderManpower.supplies = supplies;
              await queryRunner.manager.save(OrderManpower, orderManpower);
            }
          }

          order.manpowers = savedManpowers;
        } else {
          order.manpowers = null;
        }
      }

      // 9. Actualizar serviceTypes (puede ser null o array vacío)
      if ('serviceTypes' in updateOrderDto) {
        if (updateOrderDto.serviceTypes) {
          order.serviceTypes = await Promise.all(
            updateOrderDto.serviceTypes.map(async (id) => {
              const st = await this.serviceTypeService.getServiceTypeById(id);
              if (!st)
                throw new NotFoundException(
                  `ServiceType with id ${id} not found`,
                );
              return st;
            }),
          );
        } else {
          order.serviceTypes = null;
        }
      }

      // 10. Guardar la orden actualizada
      const updatedOrder = await queryRunner.manager.save(Order, order);

      await queryRunner.commitTransaction();
      return updatedOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async softDeleteOrder(id: string) {
    try {
      const order = await this.orderRepository.findOne({
        where: { idOrder: id, active: true },
      });

      if (!order) {
        throw new NotFoundException(
          `Order with id ${id} not found or already inactive`,
        );
      }

      order.active = false;
      await this.orderRepository.save(order);

      return {
        message: `Order #${id} has been soft deleted (set to inactive).`,
        order,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error.message;
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
