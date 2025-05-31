import { Entity, ManyToOne, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Order } from './order.entity';
import { Manpower } from 'src/modules/manpower/entities/manpower.entity';

@Entity()
export class OrderManpower {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.manpowers, { onDelete: 'CASCADE' })
  order: Order;

  @ManyToOne(() => Manpower, { eager: true })
  manpower: Manpower;

  @Column('float')
  costoTotal: number;

  @Column('float')
  factorVenta: number;

  @Column('float')
  ventaUnitaria: number;

  @Column('float')
  ventaTotal: number;
}
