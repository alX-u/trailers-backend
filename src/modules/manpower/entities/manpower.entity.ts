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
export class Manpower {
  @PrimaryGeneratedColumn('uuid')
  id_manpower: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  unitary_cost: number;

  //FKs
  @ManyToOne(() => User, (user) => user.idUser)
  @JoinColumn({ name: 'contractor' })
  contractor: User;

  //Date columns
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
