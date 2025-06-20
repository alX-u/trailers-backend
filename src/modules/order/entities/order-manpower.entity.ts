import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Order } from './order.entity';
import { Manpower } from 'src/modules/manpower/entities/manpower.entity';
import { OrderManpowerSupply } from 'src/modules/order/entities/order-manpower-supply.entity';
import { User } from 'src/modules/user/entities/user.entity';

@Entity()
export class OrderManpower {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.manpowers, { onDelete: 'CASCADE' })
  order: Order;

  @ManyToOne(() => Manpower, { eager: true })
  manpower: Manpower;

  @ManyToOne(() => User, (user) => user.idUser, { eager: true, nullable: true })
  selectedContractor?: User;

  @Column({ nullable: true })
  unitaryCost?: number;

  @OneToMany(
    () => OrderManpowerSupply,
    (manpowerSupply) => manpowerSupply.orderManpower,
    { eager: true, cascade: true },
  )
  supplies?: OrderManpowerSupply[] | null;

  @Column({ nullable: true })
  useDetail?: string;

  @Column({ nullable: true })
  cantidad?: number;

  @Column('float', { nullable: true })
  costoTotal?: number;

  @Column('float', { nullable: true })
  factorVenta?: number;

  @Column('float', { nullable: true })
  ventaUnitaria?: number;

  @Column('float', { nullable: true })
  ventaTotal?: number;
}
