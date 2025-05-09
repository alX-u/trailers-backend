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
  idOrder: string;

  @Column()
  orderNumber: string;

  @Column({ type: 'timestamptz' })
  outDate: Date;

  //FKs
  @ManyToOne(() => OrderStatus, (orderStatus) => orderStatus.idOrderStatus)
  orderStatus: OrderStatus;

  @ManyToOne(() => Client, (client) => client.idClient)
  @JoinColumn({ name: 'client' })
  client: Client;

  @ManyToOne(() => Vehicule, (vehicule) => vehicule.idVehicule)
  @JoinColumn({ name: 'vehicule' })
  vehicule: Vehicule;

  //Many to many relationships
  @ManyToMany(() => Billing, (billing) => billing.idBilling)
  @JoinTable()
  billings: Billing[];

  @ManyToMany(() => ServiceType, (serviceType) => serviceType.idServiceType)
  @JoinTable()
  serviceTypes: ServiceType[];

  @ManyToMany(() => Pricing, (pricing) => pricing.idPricing)
  @JoinTable()
  pricings: Pricing[];

  @ManyToMany(
    () => SparePartMaterial,
    (sparePartMaterial) => sparePartMaterial.idSparePartMaterial,
  )
  @JoinTable()
  sparePartMaterials: SparePartMaterial[];

  @ManyToMany(() => Manpower, (manpower) => manpower.idManpower)
  @JoinTable()
  manpowers: Manpower[];

  //Date columns
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
