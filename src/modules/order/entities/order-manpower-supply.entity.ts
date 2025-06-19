import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Supply } from 'src/modules/supply/entities/supply.entity';
import { OrderManpower } from 'src/modules/order/entities/order-manpower.entity';

@Entity()
export class OrderManpowerSupply {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => OrderManpower, (orderManpower) => orderManpower.supplies, {
    onDelete: 'CASCADE',
  })
  orderManpower: OrderManpower;

  @ManyToOne(() => Supply, { eager: true })
  supply: Supply;

  @Column({ nullable: true })
  unitaryCost: number;

  @Column({ nullable: true })
  cantidad: number;

  @Column('float', { nullable: true })
  costoTotal: number;

  @Column('float', { nullable: true })
  factorVenta: number;

  @Column('float', { nullable: true })
  ventaUnitaria: number;

  @Column('float', { nullable: true })
  ventaTotal: number;
}
