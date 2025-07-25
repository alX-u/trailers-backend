import { Module } from '@nestjs/common';
import { Role } from './entities/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  exports: [TypeOrmModule],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
