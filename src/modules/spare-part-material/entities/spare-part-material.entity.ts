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

  @Column({ default: true })
  active: boolean;

  // Cambia a ManyToMany
  @ManyToMany(() => Provider)
  @JoinTable({
    name: 'spare_part_material_providers',
    joinColumn: {
      name: 'sparePartMaterialId',
      referencedColumnName: 'idSparePartMaterial',
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
