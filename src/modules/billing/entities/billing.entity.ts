import { User } from 'src/modules/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Billing {
  @PrimaryGeneratedColumn('uuid')
  id_billing: string;

  @Column()
  billing_number: string;

  @Column({ type: 'timestamptz' })
  billing_date: Date;

  @ManyToOne(() => User, (user) => user.id_user)
  billed_by: User;
}
