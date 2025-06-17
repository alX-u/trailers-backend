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
  ) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    const connection = this.orderRepository.manager.connection;
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Buscar usuario asignado (assignTo)
      let assignTo = null;
      if (createOrderDto.assignTo) {
        assignTo = await this.userService.getUserById(createOrderDto.assignTo);
        if (!assignTo) {
          throw new NotFoundException(
            `User with id ${createOrderDto.assignTo} not found`,
          );
        }
        const validRoles = ['Mecánico', 'Colaborador', 'Contratista'];
        if (!validRoles.includes(assignTo.role.name)) {
          throw new NotFoundException(
            `User with id ${createOrderDto.assignTo} does not have a valid role (Mecánico, Colaborador, Contratista)`,
          );
        }
      }

      // 1. Buscar cliente por ID (si viene)
      let client = null;
      if (createOrderDto.client) {
        client = await this.clientService.getClientById(createOrderDto.client);
        if (!client) {
          throw new NotFoundException(
            `Client with id ${createOrderDto.client} not found`,
          );
        }
      }

      // 2. Buscar vehículo por ID (si viene)
      let vehicule = null;
      if (createOrderDto.vehicule) {
        vehicule = await this.vehiculeService.getVehiculeById(
          createOrderDto.vehicule,
        );
        if (!vehicule) {
          throw new NotFoundException(
            `Vehicule with id ${createOrderDto.vehicule} not found`,
          );
        }
      }

      // 3. Buscar estado de la orden (si viene)
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

      // 4. Resolver relaciones many-to-many (serviceTypes)
      let serviceTypes = [];
      if (createOrderDto.serviceTypes) {
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

      // 5. Crear los pricings dentro de la transacción
      let pricings = [];
      if (createOrderDto.pricings) {
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

      // 5.5. Crear los billings dentro de la transacción
      let billings = [];
      if (createOrderDto.billings) {
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

      // 6. Crear entidades pivot para sparePartMaterials
      let sparePartMaterials = [];
      if (createOrderDto.sparePartMaterials) {
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
            return queryRunner.manager.create(OrderSparePartMaterial, {
              sparePartMaterial: spmEntity,
              cantidad: spmDto.cantidad,
              costoTotal: spmDto.costoTotal,
              factorVenta: spmDto.factorVenta,
              ventaUnitaria: spmDto.ventaUnitaria,
              ventaTotal: spmDto.ventaTotal,
            });
          }),
        );
      }

      // 7. Crear entidades pivot para manpowers
      let manpowers = [];
      if (createOrderDto.manpowers) {
        manpowers = await Promise.all(
          createOrderDto.manpowers.map(async (mpDto) => {
            const mpEntity = await this.manpowerService.getManpowerById(
              mpDto.manpower,
            );
            if (!mpEntity)
              throw new NotFoundException(
                `Manpower with id ${mpDto.manpower} not found`,
              );
            return queryRunner.manager.create(OrderManpower, {
              manpower: mpEntity,
              cantidad: mpDto.cantidad,
              costoTotal: mpDto.costoTotal,
              factorVenta: mpDto.factorVenta,
              ventaUnitaria: mpDto.ventaUnitaria,
              ventaTotal: mpDto.ventaTotal,
            });
          }),
        );
      }

      // 8. Crear la orden
      const order = queryRunner.manager.create(Order, {
        orderNumber: createOrderDto.orderNumber ?? null,
        outDate: createOrderDto.outDate
          ? new Date(createOrderDto.outDate)
          : null,
        orderStatus: orderStatus ?? null,
        serviceTypes: serviceTypes.length ? serviceTypes : null,
        client: client ?? null,
        assignTo: assignTo ?? null,
        vehicule: vehicule ?? null,
        pricings: pricings.length ? pricings : null,
        billings: billings.length ? billings : null,
        sparePartMaterials: sparePartMaterials.length
          ? sparePartMaterials
          : null,
        manpowers: manpowers.length ? manpowers : null,
        total: createOrderDto.totals ?? null,
        active: true,
      });

      // 9. Guardar la orden
      const savedOrder = await queryRunner.manager.save(Order, order);

      await queryRunner.commitTransaction();
      return savedOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        'Unexpected error while creating order',
      );
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
        'vehicule.drivers',
        'vehicule.drivers.document',
        'vehicule.drivers.document.documentType',
        'orderStatus',
        'pricings',
        'pricings.pricedBy',
        'sparePartMaterials',
        'sparePartMaterials.sparePartMaterial.provider',
        'manpowers',
        'manpowers.manpower',
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
          'vehicule.drivers',
          'vehicule.drivers.document',
          'vehicule.vehiculeType',
          'vehicule.drivers.document.documentType',
          'orderStatus',
          'pricings',
          'pricings.pricedBy',
          'sparePartMaterials',
          'sparePartMaterials.sparePartMaterial.provider',
          'manpowers',
          'manpowers.manpower',
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
      if ('orderNumber' in updateOrderDto)
        order.orderNumber = updateOrderDto.orderNumber ?? null;
      if ('outDate' in updateOrderDto)
        order.outDate = updateOrderDto.outDate
          ? new Date(updateOrderDto.outDate)
          : null;
      if ('active' in updateOrderDto) order.active = updateOrderDto.active;
      if ('totals' in updateOrderDto)
        order.total = updateOrderDto.totals ?? null;

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
        if (updateOrderDto.assignTo) {
          const assignTo = await this.userService.getUserById(
            updateOrderDto.assignTo,
          );
          if (!assignTo) {
            throw new NotFoundException(
              `User with id ${updateOrderDto.assignTo} not found`,
            );
          }
          const validRoles = ['Mecánico', 'Colaborador', 'Contratista'];
          if (!validRoles.includes(assignTo.role.name)) {
            throw new NotFoundException(
              `User with id ${updateOrderDto.assignTo} does not have a valid role (Mecánico, Colaborador, Contratista)`,
            );
          }
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
              return queryRunner.manager.create(OrderSparePartMaterial, {
                order,
                sparePartMaterial: spmEntity,
                cantidad: spmDto.cantidad,
                costoTotal: spmDto.costoTotal,
                factorVenta: spmDto.factorVenta,
                ventaUnitaria: spmDto.ventaUnitaria,
                ventaTotal: spmDto.ventaTotal,
              });
            }),
          );
        } else {
          order.sparePartMaterials = null;
        }
      }

      // 8. Actualizar manpowers (puede ser null o array vacío)
      if ('manpowers' in updateOrderDto) {
        await queryRunner.manager.delete(OrderManpower, {
          order: { idOrder: id },
        });

        if (updateOrderDto.manpowers) {
          order.manpowers = await Promise.all(
            updateOrderDto.manpowers.map(async (mpDto) => {
              const mpEntity = await this.manpowerService.getManpowerById(
                mpDto.manpower,
              );
              if (!mpEntity)
                throw new NotFoundException(
                  `Manpower with id ${mpDto.manpower} not found`,
                );
              return queryRunner.manager.create(OrderManpower, {
                order,
                manpower: mpEntity,
                cantidad: mpDto.cantidad,
                costoTotal: mpDto.costoTotal,
                factorVenta: mpDto.factorVenta,
                ventaUnitaria: mpDto.ventaUnitaria,
                ventaTotal: mpDto.ventaTotal,
              });
            }),
          );
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
      throw new InternalServerErrorException(
        'Unexpected error while updating order',
      );
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
        throw error;
      }
      throw new InternalServerErrorException(
        'Unexpected error while soft deleting order',
      );
    }
  }
}
