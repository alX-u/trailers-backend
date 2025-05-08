import { Module } from '@nestjs/common';
import { UserStatus } from './entities/user-status.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserStatus])],
  exports: [TypeOrmModule],
})
export class UserStatusModule {}
