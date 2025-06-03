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

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  idOrder: string;

  @Column()
  orderNumber: string;

  @Column({ type: 'timestamptz' })
  outDate: Date;

  @Column({ default: true })
  active: boolean;

  //FKs
  @ManyToOne(() => OrderStatus, (orderStatus) => orderStatus.orders)
  orderStatus: OrderStatus;

  @ManyToOne(() => Client, (client) => client.orders)
  @JoinColumn({ name: 'client' })
  client: Client;

  @ManyToOne(() => Vehicule, (vehicule) => vehicule.orders)
  @JoinColumn({ name: 'vehicule' })
  vehicule: Vehicule;

  //Many to many relationships
  @ManyToMany(() => Billing, (billing) => billing.idBilling)
  @JoinTable({ name: 'order_billing' })
  billings: Billing[];

  @ManyToMany(() => ServiceType, (serviceType) => serviceType.idServiceType)
  @JoinTable({ name: 'order_serviceType' })
  serviceTypes: ServiceType[];

  @ManyToMany(() => Pricing, (pricing) => pricing.idPricing)
  @JoinTable({ name: 'order_pricing' })
  pricings: Pricing[];

  // Pivot relations for extra fields
  @OneToMany(() => OrderSparePartMaterial, (ospm) => ospm.order, {
    cascade: true,
    eager: true,
  })
  sparePartMaterials: OrderSparePartMaterial[];

  @OneToMany(() => OrderManpower, (om) => om.order, {
    cascade: true,
    eager: true,
  })
  manpowers: OrderManpower[];

  @Column({ type: 'jsonb', nullable: true })
  total: {
    subtotalCostosRepuestos: number;
    subtotalVentasRepuestos: number;
    subtotalCostosManoObra: number;
    subtotalVentasManoObra: number;
    subtotalCostos: number;
    subtotalVentas: number;
    iva: number;
    totalVenta: number;
  };

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
