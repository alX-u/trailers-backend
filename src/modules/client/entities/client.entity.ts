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
  idClient: string;

  @Column()
  name: string;

  @OneToOne(() => Document, (document) => document.idDocument)
  @JoinColumn({ name: 'document' })
  document: Document;

  @OneToMany(() => Order, (order) => order.idOrder)
  orders: Order[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
