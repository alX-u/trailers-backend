import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { ClientService } from '../client/client.service';
import { VehiculeService } from '../vehicule/vehicule.service';
import { PricingService } from '../pricing/pricing.service';
import { SparePartMaterialService } from '../spare-part-material/spare-part-material.service';
import { ManpowerService } from '../manpower/manpower.service';
import { OrderStatus } from '../order-status/entities/order-status.entity';

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
    try {
      // Resolve relations
      const client = await this.clientService.getClientById(
        createOrderDto.client,
      );
      if (!client)
        throw new NotFoundException(
          `Client with id ${createOrderDto.client} not found`,
        );

      const vehicule = await this.vehiculeService.getVehiculeById(
        createOrderDto.vehicule,
      );
      if (!vehicule)
        throw new NotFoundException(
          `Vehicule with id ${createOrderDto.vehicule} not found`,
        );

      const orderStatus = await this.orderStatusRepository.findOne({
        where: { idOrderStatus: createOrderDto.orderStatus },
      });
      if (!orderStatus)
        throw new NotFoundException(
          `OrderStatus with id ${createOrderDto.orderStatus} not found`,
        );

      // Resolve many-to-many relations
      const pricings = await Promise.all(
        (createOrderDto.pricings || []).map(async (id) => {
          const pricing = await this.pricingService.getPricingById(id);
          if (!pricing)
            throw new NotFoundException(`Pricing with id ${id} not found`);
          return pricing;
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

      // Create the order entity
      const order = this.orderRepository.create({
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

      // Save and return the order
      return await this.orderRepository.save(order);
    } catch (error) {
      throw new InternalServerErrorException(
        'Unexpected error while creating order',
      );
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
    try {
      // Fetch the existing order
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

      // Update scalar fields if provided
      if (updateOrderDto.orderNumber !== undefined) {
        order.orderNumber = updateOrderDto.orderNumber;
      }
      if (updateOrderDto.outDate !== undefined) {
        order.outDate = updateOrderDto.outDate;
      }
      if (updateOrderDto.active !== undefined) {
        order.active = updateOrderDto.active;
      }

      // Update relations if provided
      if (updateOrderDto.client !== undefined) {
        const client = await this.clientService.getClientById(
          updateOrderDto.client,
        );
        if (!client)
          throw new NotFoundException(
            `Client with id ${updateOrderDto.client} not found`,
          );
        order.client = client;
      }

      if (updateOrderDto.vehicule !== undefined) {
        const vehicule = await this.vehiculeService.getVehiculeById(
          updateOrderDto.vehicule,
        );
        if (!vehicule)
          throw new NotFoundException(
            `Vehicule with id ${updateOrderDto.vehicule} not found`,
          );
        order.vehicule = vehicule;
      }

      if (updateOrderDto.orderStatus !== undefined) {
        const orderStatus = await this.orderStatusRepository.findOne({
          where: { idOrderStatus: updateOrderDto.orderStatus },
        });
        if (!orderStatus)
          throw new NotFoundException(
            `OrderStatus with id ${updateOrderDto.orderStatus} not found`,
          );
        order.orderStatus = orderStatus;
      }

      if (updateOrderDto.pricings !== undefined) {
        const pricings = await Promise.all(
          updateOrderDto.pricings.map(async (id) => {
            const pricing = await this.pricingService.getPricingById(id);
            if (!pricing)
              throw new NotFoundException(`Pricing with id ${id} not found`);
            return pricing;
          }),
        );
        order.pricings = pricings;
      }

      if (updateOrderDto.sparePartMaterials !== undefined) {
        const sparePartMaterials = await Promise.all(
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
        order.sparePartMaterials = sparePartMaterials;
      }

      if (updateOrderDto.manpowers !== undefined) {
        const manpowers = await Promise.all(
          updateOrderDto.manpowers.map(async (id) => {
            const manpower = await this.manpowerService.getManpowerById(id);
            if (!manpower)
              throw new NotFoundException(`Manpower with id ${id} not found`);
            return manpower;
          }),
        );
        order.manpowers = manpowers;
      }

      // Save and return the updated order
      return await this.orderRepository.save(order);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Unexpected error while updating order',
      );
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
