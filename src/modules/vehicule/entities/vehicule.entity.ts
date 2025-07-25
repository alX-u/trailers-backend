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
  idVehicule: string;

  @Column()
  placaCabezote: string;

  @Column()
  placaTrailer: string;

  @Column({ nullable: true })
  kmsSalida: number;

  @Column({ default: true })
  active: boolean;

  //Fk
  @ManyToOne(() => VehiculeType, (vehiculeType) => vehiculeType.vehicules)
  @JoinColumn({ name: 'vehiculeType' })
  vehiculeType: VehiculeType;

  @OneToMany(() => Order, (order) => order.idOrder)
  orders: Order[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
