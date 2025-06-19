import { Provider } from 'src/modules/provider/entities/provider.entity';
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
export class Supply {
  @PrimaryGeneratedColumn('uuid')
  idSupply: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  measurementUnit: string;

  @Column({ default: true })
  active: boolean;

  @ManyToMany(() => Provider)
  @JoinTable({
    name: 'supply_providers',
    joinColumn: {
      name: 'supplyId',
      referencedColumnName: 'idSupply',
    },
    inverseJoinColumn: {
      name: 'providerId',
      referencedColumnName: 'idProvider',
    },
  })
  providers: Provider[];

  //Date columns
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
