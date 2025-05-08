import { Driver } from 'src/modules/driver/entities/driver.entity';
import { Order } from 'src/modules/order/entities/order.entity';
import { VehiculeType } from 'src/modules/vehicule-type/entities/vehicule-type.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Vehicule {
  @PrimaryGeneratedColumn('uuid')
  id_vehicule: string;

  @Column()
  placa_cabezote: string;

  @Column()
  placa_trailer: string;

  @Column()
  kms_salida: number;

  @ManyToOne(() => VehiculeType, (vehiculeType) => vehiculeType.vehicules)
  @JoinColumn({ name: 'vehicule_type' })
  vehicule_type: VehiculeType;

  @ManyToOne(() => Driver, (driver) => driver.id_driver)
  @JoinColumn({ name: 'driver' })
  driver: Driver;

  @OneToMany(() => Order, (order) => order.id_order)
  orders: Order[];

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
