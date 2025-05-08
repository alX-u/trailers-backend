import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DocumentModule } from '../document/document.module';
import { RoleModule } from '../role/role.module';
import { UserStatusModule } from '../user-status/user-status.module';
import { DocumentTypeModule } from '../document-type/document-type.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    TypeOrmModule.forFeature([User]),
    DocumentModule,
    RoleModule,
    DocumentTypeModule,
    UserStatusModule,
  ],
  exports: [TypeOrmModule],
})
export class UserModule {}
