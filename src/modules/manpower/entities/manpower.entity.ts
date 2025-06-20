import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Manpower {
  @PrimaryGeneratedColumn('uuid')
  idManpower: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @ManyToOne(() => User, (user) => user.idUser, { nullable: true })
  contractor: User;

  @Column({ default: true })
  active: boolean;

  //Date columns
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
