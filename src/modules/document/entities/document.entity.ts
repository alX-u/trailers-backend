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

  @Column({ nullable: true, default: true })
  active: boolean;

  @ManyToOne(() => DocumentType, (document) => document.idDocumentType)
  @JoinColumn({ name: 'documentType' })
  documentType: DocumentType;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
