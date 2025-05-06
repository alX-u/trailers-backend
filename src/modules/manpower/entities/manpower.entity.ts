import { Contractor } from 'src/modules/contractor/entities/contractor.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Manpower {
  @PrimaryGeneratedColumn('uuid')
  id_manpower: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  unitary_cost: number;

  //FKs
  @ManyToOne(() => Contractor, (contractor) => contractor.id_contractor)
  contractor: Contractor;

  //Date columns
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
