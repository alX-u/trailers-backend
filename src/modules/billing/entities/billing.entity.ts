import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Billing {
  @PrimaryGeneratedColumn('uuid')
  idBilling: string;

  @Column({ unique: true })
  billingNumber: string;

  @Column({ type: 'timestamptz' })
  billingDate: Date;

  @Column({ unique: true })
  actNumber: string;

  @Column({ default: false })
  active: boolean;

  @ManyToOne(() => User, (user) => user.idUser)
  @JoinColumn({ name: 'billedBy' })
  billedBy: User;
}
