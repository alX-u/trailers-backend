import { User } from 'src/modules/user/entities/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Pricing {
  @PrimaryGeneratedColumn('uuid')
  id_pricing: string;

  @Column()
  pricing_number: string;

  @Column({ type: 'timestamptz' })
  pricing_date: Date;

  //FKs
  @OneToMany(() => User, (user) => user.id_user)
  user: User;
}
