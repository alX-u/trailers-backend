import { Provider } from 'src/modules/provider/entities/provider.entity';
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
export class SparePartMaterial {
  @PrimaryGeneratedColumn('uuid')
  idSparePartMaterial: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  measurementUnit: string;

  @Column()
  unitaryCost: number;

  @Column()
  quantity: number;

  //FKs
  @ManyToOne(() => Provider, (provider) => provider.idProvider)
  @JoinColumn({ name: 'provider' })
  provider: Provider;

  //Date columns
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
