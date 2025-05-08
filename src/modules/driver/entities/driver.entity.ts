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
  id_driver: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  phone_number: string;

  @OneToOne(() => Document, (document) => document.id_document)
  @JoinColumn({ name: 'document' })
  document: Document;

  @OneToMany(() => Vehicule, (vehicule) => vehicule.id_vehicule)
  vehicules: Vehicule[];

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
