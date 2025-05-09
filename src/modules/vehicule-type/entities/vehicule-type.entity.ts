import { Vehicule } from 'src/modules/vehicule/entities/vehicule.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class VehiculeType {
  @PrimaryGeneratedColumn('uuid')
  idVehiculeType: string;

  @Column()
  name: string;

  @OneToMany(() => Vehicule, (vehicule) => vehicule.idVehicule)
  vehicules: Vehicule[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
