import { Provider } from 'src/modules/provider/entities/provider.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class SparePartMaterial {
  @PrimaryGeneratedColumn('uuid')
  id_spare_part_material: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  measurement_unit: string;

  @Column()
  unitary_cost: number;

  //FKs
  @ManyToOne(() => Provider, (provider) => provider.id_provider)
  provider: Provider;

  //Date columns
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
