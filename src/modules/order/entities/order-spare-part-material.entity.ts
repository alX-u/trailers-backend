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

  @Column({ nullable: true })
  cantidad: number;

  @Column('float')
  costoTotal: number;

  @Column('float')
  factorVenta: number;

  @Column('float')
  ventaUnitaria: number;

  @Column('float')
  ventaTotal: number;
}
