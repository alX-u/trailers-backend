import { Client } from 'src/modules/client/entities/client.entity';
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
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  idContact: string;

  @Column()
  name: string;

  @Column()
  phone_number: string;

  @ManyToOne(() => Client, (client) => client.idClient)
  @JoinColumn({ name: 'client' })
  client: Client;

  @Column()
  isPrincipalContact: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
