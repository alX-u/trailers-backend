import { Document } from 'src/modules/document/entities/document.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Provider {
  @PrimaryGeneratedColumn('uuid')
  id_provider: string;

  @Column()
  name: string;

  //FKs
  @OneToOne(() => Document, (document) => document.id_document)
  @JoinColumn({ name: 'document' })
  document: Document;

  //Date columns
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
