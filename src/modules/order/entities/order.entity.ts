import { Billing } from 'src/modules/billing/entities/billing.entity';
import { Client } from 'src/modules/client/entities/client.entity';
import { OrderStatus } from 'src/modules/order-status/entities/order-status.entity';
import { Pricing } from 'src/modules/pricing/entities/pricing.entity';
import { ServiceType } from 'src/modules/service-type/entities/service-type.entity';
import { Vehicule } from 'src/modules/vehicule/entities/vehicule.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderSparePartMaterial } from './order-spare-part-material.entity';
import { OrderManpower } from './order-manpower.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Driver } from 'src/modules/driver/entities/driver.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  idOrder: string;

  @Column({ nullable: true, unique: true })
  orderNumber?: string;

  @Column({ type: 'timestamptz', nullable: true })
  outDate?: Date;

  @Column({ default: true, nullable: true })
  active?: boolean;

  //FKs
  @ManyToOne(() => OrderStatus, (orderStatus) => orderStatus.orders, {
    nullable: true,
  })
  orderStatus?: OrderStatus;

  @ManyToOne(() => User, (user) => user.idUser, { nullable: true })
  @JoinColumn({ name: 'assignTo' })
  assignTo?: User;

  @ManyToOne(() => Client, (client) => client.orders, { nullable: true })
  @JoinColumn({ name: 'client' })
  client?: Client;

  @ManyToOne(() => Vehicule, (vehicule) => vehicule.orders, { nullable: true })
  @JoinColumn({ name: 'vehicule' })
  vehicule?: Vehicule;

  @ManyToOne(() => Driver, (driver) => driver.idDriver, { nullable: true })
  @JoinColumn({ name: 'assignedDriver' })
  assignedDriver?: Driver;

  //Many to many relationships
  @ManyToMany(() => Billing, (billing) => billing.idBilling, { nullable: true })
  @JoinTable({ name: 'order_billing' })
  billings?: Billing[];

  @ManyToMany(() => ServiceType, (serviceType) => serviceType.idServiceType, {
    nullable: true,
  })
  @JoinTable({ name: 'order_serviceType' })
  serviceTypes?: ServiceType[];

  @ManyToMany(() => Pricing, (pricing) => pricing.idPricing, { nullable: true })
  @JoinTable({ name: 'order_pricing' })
  pricings?: Pricing[];

  // Pivot relations for extra fields
  @OneToMany(() => OrderSparePartMaterial, (ospm) => ospm.order, {
    cascade: true,
    eager: true,
    nullable: true,
  })
  sparePartMaterials?: OrderSparePartMaterial[] | null;

  @OneToMany(() => OrderManpower, (om) => om.order, {
    cascade: true,
    eager: true,
    nullable: true,
  })
  manpowers?: OrderManpower[] | null;

  @Column({ type: 'jsonb', nullable: true })
  total?: {
    subtotalCostosRepuestos: number;
    subtotalVentasRepuestos: number;
    subtotalCostosManoObra: number;
    subtotalVentasManoObra: number;
    subtotalCostos: number;
    subtotalVentas: number;
    iva: number;
    totalVenta: number;
  };

  @CreateDateColumn({ type: 'timestamptz', nullable: true })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamptz', nullable: true })
  updatedAt?: Date;
}
