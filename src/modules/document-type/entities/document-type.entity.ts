import { Document } from 'src/modules/document/entities/document.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class DocumentType {
  @PrimaryGeneratedColumn('uuid')
  idDocumentType: string;

  @Column()
  name: string;

  @Column()
  abbreviation: string;

  @OneToMany(() => Document, (document) => document.idDocument)
  documents: Document[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
