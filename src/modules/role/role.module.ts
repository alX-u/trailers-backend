import { Module } from '@nestjs/common';
import { Role } from './entities/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  exports: [TypeOrmModule],
})
export class RoleModule {}
