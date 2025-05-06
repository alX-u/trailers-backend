import { Document } from 'src/modules/document/entities/document.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Contractor {
  @PrimaryGeneratedColumn('uuid')
  id_contractor: string;

  @Column()
  name: string;

  //Fks
  @OneToOne(() => Document, (document) => document.id_document)
  document: Document;

  //Date columns
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
