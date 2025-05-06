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
  id_vehicule_type: string;

  @Column()
  name: string;

  @OneToMany(() => Vehicule, (vehicule) => vehicule.id_vehicule)
  vehicules: Vehicule[];

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
