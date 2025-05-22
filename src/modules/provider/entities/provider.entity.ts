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
  idProvider: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phoneNumber: string;

  //FKs
  @OneToOne(() => Document, (document) => document.idDocument, {
    cascade: ['insert', 'update', 'remove', 'soft-remove', 'recover'],
  })
  @JoinColumn({ name: 'document' })
  document: Document;

  //Date columns
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
