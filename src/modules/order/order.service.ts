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
  ) {}
  async createOrder(createOrderDto: CreateOrderDto) {
    const connection = this.orderRepository.manager.connection;
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Crear cliente
      const client = await this.clientService.createClient(
        createOrderDto.client,
        queryRunner.manager,
      );

      // 2. Crear vehículo
      const vehicule = await this.vehiculeService.createVehicule(
        createOrderDto.vehicule,
        queryRunner.manager,
      );

      // 3. Buscar estado de la orden
      const orderStatus = await queryRunner.manager.findOne(OrderStatus, {
        where: { idOrderStatus: createOrderDto.orderStatus },
      });
      if (!orderStatus)
        throw new NotFoundException(
          `OrderStatus with id ${createOrderDto.orderStatus} not found`,
        );

      // 4. Resolver relaciones many-to-many
      // 4. Crear los pricings dentro de la transacción
      const pricings = await Promise.all(
        (createOrderDto.pricings || []).map(async (pricingDto) => {
          return await this.pricingService.createPricing(
            pricingDto,
            queryRunner.manager,
          );
        }),
      );

      const sparePartMaterials = await Promise.all(
        (createOrderDto.sparePartMaterials || []).map(async (id) => {
          const spm =
            await this.sparePartMaterialService.getSparepartMaterialById(id);
          if (!spm)
            throw new NotFoundException(
              `SparePartMaterial with id ${id} not found`,
            );
          return spm;
        }),
      );

      const manpowers = await Promise.all(
        (createOrderDto.manpowers || []).map(async (id) => {
          const manpower = await this.manpowerService.getManpowerById(id);
          if (!manpower)
            throw new NotFoundException(`Manpower with id ${id} not found`);
          return manpower;
        }),
      );

      // 5. Crear la orden
      const order = queryRunner.manager.create(Order, {
        orderNumber: createOrderDto.orderNumber,
        outDate: createOrderDto.outDate,
        orderStatus,
        client,
        vehicule,
        pricings,
        sparePartMaterials,
        manpowers,
        active: true,
      });

      // 6. Guardar la orden
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
          'vehicule',
          'orderStatus',
          'pricings',
          'sparePartMaterials',
          'manpowers',
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
          'vehicule',
          'orderStatus',
          'pricings',
          'sparePartMaterials',
          'manpowers',
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
          'sparePartMaterials',
          'manpowers',
        ],
      });
      if (!order) {
        throw new NotFoundException(`Order with id ${id} not found`);
      }

      // 2. Actualizar campos simples
      if (updateOrderDto.orderNumber !== undefined)
        order.orderNumber = updateOrderDto.orderNumber;
      if (updateOrderDto.outDate !== undefined)
        order.outDate = updateOrderDto.outDate;
      if (updateOrderDto.active !== undefined)
        order.active = updateOrderDto.active;

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
          updateOrderDto.pricings.map((pricingDto) =>
            this.pricingService.createPricing(pricingDto, queryRunner.manager),
          ),
        );
      }

      // 7. Actualizar sparePartMaterials (reemplaza todos si se envía el array)
      if (updateOrderDto.sparePartMaterials) {
        order.sparePartMaterials = await Promise.all(
          updateOrderDto.sparePartMaterials.map(async (id) => {
            const spm =
              await this.sparePartMaterialService.getSparepartMaterialById(id);
            if (!spm)
              throw new NotFoundException(
                `SparePartMaterial with id ${id} not found`,
              );
            return spm;
          }),
        );
      }

      // 8. Actualizar manpowers (reemplaza todos si se envía el array)
      if (updateOrderDto.manpowers) {
        order.manpowers = await Promise.all(
          updateOrderDto.manpowers.map(async (id) => {
            const manpower = await this.manpowerService.getManpowerById(id);
            if (!manpower)
              throw new NotFoundException(`Manpower with id ${id} not found`);
            return manpower;
          }),
        );
      }

      // 9. Guardar la orden actualizada
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
