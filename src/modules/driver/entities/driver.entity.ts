import { Document } from 'src/modules/document/entities/document.entity';
import { Vehicule } from 'src/modules/vehicule/entities/vehicule.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Driver {
  @PrimaryGeneratedColumn('uuid')
  idDriver: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phoneNumber: string;

  @OneToOne(() => Document, (document) => document.idDocument)
  @JoinColumn({ name: 'document' })
  document: Document;

  @OneToMany(() => Vehicule, (vehicule) => vehicule.idVehicule)
  vehicules: Vehicule[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
