import { DocumentType } from 'src/modules/document-type/entities/document-type.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id_document: string;

  @Column()
  document_number: number;

  @ManyToOne(() => DocumentType, (document) => document.id_document_type)
  document_type: DocumentType;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
