import { Billing } from 'src/modules/billing/entities/billing.entity';
import { Client } from 'src/modules/client/entities/client.entity';
import { Manpower } from 'src/modules/manpower/entities/manpower.entity';
import { OrderStatus } from 'src/modules/order-status/entities/order-status.entity';
import { Pricing } from 'src/modules/pricing/entities/pricing.entity';
import { ServiceType } from 'src/modules/service-type/entities/service-type.entity';
import { SparePartMaterial } from 'src/modules/spare-part-material/entities/spare-part-material.entity';
import { Vehicule } from 'src/modules/vehicule/entities/vehicule.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id_order: string;

  @Column()
  order_number: string;

  @Column({ type: 'timestamptz' })
  out_date: Date;

  //FKs
  @ManyToOne(() => OrderStatus, (orderStatus) => orderStatus.id_order_status)
  order_status: OrderStatus;

  @ManyToOne(() => Client, (client) => client.id_client)
  @JoinColumn({ name: 'client' })
  client: Client;

  @ManyToOne(() => Vehicule, (vehicule) => vehicule.id_vehicule)
  @JoinColumn({ name: 'vehicule' })
  vehicule: Vehicule;

  //Many to many relationships
  @ManyToMany(() => Billing, (billing) => billing.idBilling)
  @JoinTable()
  billings: Billing[];

  @ManyToMany(() => ServiceType, (serviceType) => serviceType.id_service_type)
  @JoinTable()
  service_types: ServiceType[];

  @ManyToMany(() => Pricing, (pricing) => pricing.id_pricing)
  @JoinTable()
  pricings: Pricing[];

  @ManyToMany(
    () => SparePartMaterial,
    (sparePartMaterial) => sparePartMaterial.id_spare_part_material,
  )
  @JoinTable()
  spare_part_materials: SparePartMaterial[];

  @ManyToMany(() => Manpower, (manpower) => manpower.id_manpower)
  @JoinTable()
  manpowers: Manpower[];

  //Date columns
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
