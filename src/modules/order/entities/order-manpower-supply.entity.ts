import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Supply } from 'src/modules/supply/entities/supply.entity';
import { OrderManpower } from 'src/modules/order/entities/order-manpower.entity';
import { Provider } from 'src/modules/provider/entities/provider.entity';

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

  @ManyToOne(() => Provider, (provider) => provider.idProvider, {
    eager: true,
    nullable: true,
  })
  selectedProvider?: Provider;

  @Column({ nullable: true })
  unitaryCost?: number;

  @Column({ nullable: true })
  cantidad?: number;

  @Column('float', { nullable: true })
  costoTotal: number;
}
