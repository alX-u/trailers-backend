import { User } from 'src/modules/user/entities/user.entity';
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
export class Pricing {
  @PrimaryGeneratedColumn('uuid')
  idPricing: string;

  @Column()
  pricingNumber: string;

  @Column({ type: 'timestamptz' })
  pricingDate: Date;

  //FKs
  @ManyToOne(() => User, (user) => user.idUser)
  @JoinColumn({ name: 'user' })
  user: User;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
