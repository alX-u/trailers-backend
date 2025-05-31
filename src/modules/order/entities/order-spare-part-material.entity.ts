import { Entity, ManyToOne, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Order } from './order.entity';
import { SparePartMaterial } from 'src/modules/spare-part-material/entities/spare-part-material.entity';

@Entity()
export class OrderSparePartMaterial {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.sparePartMaterials, {
    onDelete: 'CASCADE',
  })
  order: Order;

  @ManyToOne(() => SparePartMaterial, { eager: true })
  sparePartMaterial: SparePartMaterial;

  @Column('float')
  totalCost: number;

  @Column('float')
  sellFactor: number;

  @Column('float')
  unitSell: number;

  @Column('float')
  totalSell: number;
}
