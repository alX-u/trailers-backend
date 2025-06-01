import {
  BadRequestException,
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
    private readonly billingService: BillingService, // Asegúrate de que BillingService esté importado correctamente
  ) {}
  async createOrder(createOrderDto: CreateOrderDto) {
    const connection = this.orderRepository.manager.connection;
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Validaciones adicionales
      if (!createOrderDto.sparePartMaterials?.length) {
        throw new BadRequestException('sparePartMaterials cannot be empty');
      }
      if (!createOrderDto.manpowers?.length) {
        throw new BadRequestException('manpowers cannot be empty');
      }
      if (!createOrderDto.totals) {
        throw new BadRequestException('totals is required');
      }

      // 1. Crear cliente
      console.log('Antes de crear cliente');
      let client;
      try {
        client = await this.clientService.createClient(
          createOrderDto.client,
          queryRunner.manager,
        );
        console.log('Client created:', client);
      } catch (error) {
        console.error('Error creating client:', error);
        throw new BadRequestException(
          'Error creating client: ' + error.message,
        );
      }

      // 2. Crear vehículo
      const vehicule = await this.vehiculeService.createVehicule(
        createOrderDto.vehicule,
        queryRunner.manager,
      );

      console.log('Vehicule created:', vehicule);

      // 3. Buscar estado de la orden
      const orderStatus = await queryRunner.manager.findOne(OrderStatus, {
        where: { idOrderStatus: createOrderDto.orderStatus },
      });
      if (!orderStatus)
        throw new NotFoundException(
          `OrderStatus with id ${createOrderDto.orderStatus} not found`,
        );
      console.log('OrderStatus found:', orderStatus);

      // 4. Resolver relaciones many-to-many
      const serviceTypes = await Promise.all(
        (createOrderDto.serviceTypes || []).map(async (id) => {
          const st = await this.serviceTypeService.getServiceTypeById(id);
          if (!st)
            throw new NotFoundException(`ServiceType with id ${id} not found`);
          return st;
        }),
      );
      console.log('ServiceTypes resolved:', serviceTypes);

      // 5. Crear los pricings dentro de la transacción
      const pricings = await Promise.all(
        (createOrderDto.pricings || []).map(async (pricingDto) => {
          // Conversión de fecha si es string
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
      console.log('Pricings created:', pricings);

      //5.5. Crear los pricings dentro de la transacción
      const billings = await Promise.all(
        (createOrderDto.billings || []).map(async (billingDto) => {
          // Conversión de fecha si es string
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

      // 6. Crear entidades pivot para sparePartMaterials
      const sparePartMaterials = await Promise.all(
        (createOrderDto.sparePartMaterials || []).map(async (spmDto) => {
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
      console.log('SparePartMaterials created:', sparePartMaterials);

      // 7. Crear entidades pivot para manpowers
      const manpowers = await Promise.all(
        (createOrderDto.manpowers || []).map(async (mpDto) => {
          const mpEntity = await this.manpowerService.getManpowerById(
            mpDto.manpower,
          );
          if (!mpEntity)
            throw new NotFoundException(
              `Manpower with id ${mpDto.manpower} not found`,
            );
          return queryRunner.manager.create(OrderManpower, {
            manpower: mpEntity,
            costoTotal: mpDto.costoTotal,
            factorVenta: mpDto.factorVenta,
            ventaUnitaria: mpDto.ventaUnitaria,
            ventaTotal: mpDto.ventaTotal,
          });
        }),
      );
      console.log('Manpowers created:', manpowers);

      // 8. Crear la orden
      const order = queryRunner.manager.create(Order, {
        orderNumber: createOrderDto.orderNumber,
        outDate: new Date(createOrderDto.outDate), // Conversión aquí
        orderStatus,
        serviceTypes,
        client,
        vehicule,
        pricings,
        billings,
        sparePartMaterials,
        manpowers,
        total: createOrderDto.totals,
        active: true,
      });

      // 9. Guardar la orden
      const savedOrder = await queryRunner.manager.save(Order, order);

      await queryRunner.commitTransaction();
      return savedOrder;
    } catch (error) {
      // Puedes loggear el error aquí si lo deseas
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
  }: {
    limit?: number;
    offset?: number;
  }) {
    const take = limit ?? 10;
    const skip = offset ?? 0;

    try {
      const [orders, total] = await this.orderRepository.findAndCount({
        where: { active: true },
        relations: [
          'client',
          'client.document',
          'vehicule',
          'vehicule.driver',
          'vehicule.driver.document',
          'orderStatus',
          'pricings',
          'sparePartMaterials',
          'manpowers',
          'manpowers.manpower',
          'manpowers.manpower.contractor',
          'billings',
          'serviceTypes',
        ],
        take,
        skip,
        order: { createdAt: 'DESC' },
      });

      return {
        data: orders,
        total,
        limit: take,
        offset: skip,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Unexpected error while fetching orders',
      );
    }
  }

  async findOrderById(id: string) {
    try {
      const order = await this.orderRepository.findOne({
        where: { idOrder: id, active: true },
        relations: [
          'client',
          'client.document',
          'vehicule',
          'vehicule.driver',
          'vehicule.driver.document',
          'orderStatus',
          'pricings',
          'sparePartMaterials',
          'manpowers',
          'manpowers.manpower',
          'manpowers.manpower.contractor',
          'billings',
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

      // 2. Actualizar campos simples
      if (updateOrderDto.orderNumber !== undefined)
        order.orderNumber = updateOrderDto.orderNumber;
      if (updateOrderDto.outDate !== undefined)
        order.outDate = new Date(updateOrderDto.outDate);
      if (updateOrderDto.active !== undefined)
        order.active = updateOrderDto.active;
      if (updateOrderDto.totals !== undefined)
        order.total = updateOrderDto.totals;

      // 3. Actualizar estado de la orden
      if (updateOrderDto.orderStatus) {
        const orderStatus = await queryRunner.manager.findOne(OrderStatus, {
          where: { idOrderStatus: updateOrderDto.orderStatus },
        });
        if (!orderStatus)
          throw new NotFoundException(
            `OrderStatus with id ${updateOrderDto.orderStatus} not found`,
          );
        order.orderStatus = orderStatus;
      }

      // 4. Actualizar cliente
      if (updateOrderDto.client) {
        order.client = await this.clientService.updateClient(
          order.client.idClient,
          updateOrderDto.client,
          queryRunner.manager,
        );
      }

      // 5. Actualizar vehículo
      if (updateOrderDto.vehicule) {
        order.vehicule = await this.vehiculeService.updateVehicule(
          order.vehicule.idVehicule,
          updateOrderDto.vehicule,
          queryRunner.manager,
        );
      }

      // 6. Actualizar pricings (reemplaza todos si se envía el array)
      if (updateOrderDto.pricings) {
        order.pricings = await Promise.all(
          updateOrderDto.pricings.map((pricingDto) => {
            const dto = {
              ...pricingDto,
              pricingDate: new Date(pricingDto.pricingDate),
            };
            return this.pricingService.createPricing(dto, queryRunner.manager);
          }),
        );
      }

      // 6.5. Actualizar billings (reemplaza todos si se envía el array)
      if (updateOrderDto.billings) {
        order.billings = await Promise.all(
          updateOrderDto.billings.map((billingDto) => {
            const dto = {
              ...billingDto,
              billingDate: new Date(billingDto.billingDate),
            };
            return this.billingService.createBilling(dto, queryRunner.manager);
          }),
        );
      }

      // 7. Actualizar sparePartMaterials (entidades pivot)
      if (updateOrderDto.sparePartMaterials) {
        await queryRunner.manager.delete(OrderSparePartMaterial, {
          order: { idOrder: id },
        });

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
      }

      // 8. Actualizar manpowers (entidades pivot)
      if (updateOrderDto.manpowers) {
        await queryRunner.manager.delete(OrderManpower, {
          order: { idOrder: id },
        });

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
              costoTotal: mpDto.costoTotal,
              factorVenta: mpDto.factorVenta,
              ventaUnitaria: mpDto.ventaUnitaria,
              ventaTotal: mpDto.ventaTotal,
            });
          }),
        );
      }

      // 9. Actualizar serviceTypes (reemplaza todos si se envía el array)
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
