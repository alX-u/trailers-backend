import { DocumentType } from 'src/modules/document-type/entities/document-type.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Document {
  @PrimaryGeneratedColumn('uuid')
  idDocument: string;

  @Column({ unique: true })
  documentNumber: string;

  @ManyToOne(() => DocumentType, (document) => document.idDocumentType)
  @JoinColumn({ name: 'document_type' })
  documentType: DocumentType;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
