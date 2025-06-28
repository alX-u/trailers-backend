import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto);
  }

  @Get('all')
  getAllOrdersNoPagination(
    @Query('search') search?: string,
    @Query('showActiveOnly') showActiveOnly?: string,
  ) {
    return this.orderService.getAllOrdersNoPagination(
      search,
      showActiveOnly === 'true',
    );
  }

  @Get()
  getAllOrdersPaginated(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('userId') userId?: string,
    @Query('search') search?: string,
    @Query('showActiveOnly') showActiveOnly?: string,
  ) {
    return this.orderService.getAllOrdersPaginated({
      limit,
      offset,
      userId,
      search,
      showActiveOnly: showActiveOnly === 'true',
    });
  }

  @Get(':id')
  findOrderById(@Param('id') id: string) {
    return this.orderService.findOrderById(id);
  }

  @Patch(':id')
  updateOrder(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.updateOrder(id, updateOrderDto);
  }

  @Delete(':id')
  softDeleteOrder(@Param('id') id: string) {
    return this.orderService.softDeleteOrder(id);
  }
}
