import {
  Column,
  CreateDateColumn,
  Entity,
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

  @Column()
  unitaryCost: number;

  @Column({ default: true })
  active: boolean;

  //Date columns
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
