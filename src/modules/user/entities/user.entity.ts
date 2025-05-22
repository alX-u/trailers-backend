import { Document } from 'src/modules/document/entities/document.entity';
import { Manpower } from 'src/modules/manpower/entities/manpower.entity';
import { Role } from 'src/modules/role/entities/role.entity';
import { UserStatus } from 'src/modules/user-status/entities/user-status.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  idUser: string;

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

  //Fks
  @ManyToOne(() => Role, (role) => role.idRole)
  @JoinColumn({ name: 'role' })
  role: Role;

  @OneToMany(() => Manpower, (manpower) => manpower.idManpower)
  manpowers: Manpower[];

  @OneToOne(() => Document, (document) => document.idDocument, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'document' })
  document: Document;

  @ManyToOne(() => UserStatus, (userStatus) => userStatus.idUserStatus)
  @JoinColumn({ name: 'userStatus' })
  userStatus: UserStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
