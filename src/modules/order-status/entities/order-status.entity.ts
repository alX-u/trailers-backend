import { Order } from 'src/modules/order/entities/order.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class OrderStatus {
  @PrimaryGeneratedColumn('uuid')
  idOrderStatus: string;

  @Column()
  name: string;

  @OneToMany(() => Order, (order) => order.idOrder)
  orders: Order[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
