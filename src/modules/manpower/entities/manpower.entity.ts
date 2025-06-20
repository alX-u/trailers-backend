import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
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

  @ManyToMany(() => User)
  @JoinTable({
    name: 'manpower_contractors',
    joinColumn: {
      name: 'manpowerId',
      referencedColumnName: 'idManpower',
    },
    inverseJoinColumn: {
      name: 'userId',
      referencedColumnName: 'idUser',
    },
  })
  contractors: User[];

  @Column({ default: true })
  active: boolean;

  //Date columns
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
