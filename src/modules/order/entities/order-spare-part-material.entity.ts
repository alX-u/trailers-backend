import { Entity, ManyToOne, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Order } from './order.entity';
import { SparePartMaterial } from 'src/modules/spare-part-material/entities/spare-part-material.entity';
import { Provider } from 'src/modules/provider/entities/provider.entity';

@Entity()
export class OrderSparePartMaterial {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.sparePartMaterials, {
    onDelete: 'CASCADE',
  })
  order: Order;

  @ManyToOne(() => Provider, (provider) => provider.idProvider, {
    eager: true,
    nullable: true,
  })
  selectedProvider?: Provider;

  @ManyToOne(() => SparePartMaterial, { eager: true })
  sparePartMaterial: SparePartMaterial;

  @Column({ nullable: true })
  unitaryCost?: number;

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
