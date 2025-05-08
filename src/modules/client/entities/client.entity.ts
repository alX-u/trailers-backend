import { Document } from 'src/modules/document/entities/document.entity';
import { Order } from 'src/modules/order/entities/order.entity';
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
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id_client: string;

  @Column()
  name: string;

  @OneToOne(() => Document, (document) => document.id_document)
  @JoinColumn({ name: 'document' })
  document: Document;

  @OneToMany(() => Order, (order) => order.id_order)
  orders: Order[];

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
