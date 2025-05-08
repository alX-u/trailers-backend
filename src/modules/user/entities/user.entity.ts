import { Document } from 'src/modules/document/entities/document.entity';
import { Role } from 'src/modules/role/entities/role.entity';
import { UserStatus } from 'src/modules/user-status/entities/user-status.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id_user: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  phone: string;

  @ManyToOne(() => Role, (role) => role.id_role)
  role: Role;

  @OneToOne(() => Document, (document) => document.id_document, {
    cascade: true,
  })
  @JoinColumn()
  document: Document;

  @ManyToOne(() => UserStatus, (userStatus) => userStatus.id_user_status)
  userStatus: UserStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
