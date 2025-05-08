import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Pricing {
  @PrimaryGeneratedColumn('uuid')
  id_pricing: string;

  @Column()
  pricing_number: string;

  @Column({ type: 'timestamptz' })
  pricing_date: Date;

  //FKs
  @ManyToOne(() => User, (user) => user.idUser)
  @JoinColumn({ name: 'user' })
  user: User;
}
