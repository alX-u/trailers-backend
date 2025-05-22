import { Module } from '@nestjs/common';
import { UserStatus } from './entities/user-status.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserStatusController } from './user-status.controller';
import { UserStatusService } from './user-status.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserStatus])],
  exports: [TypeOrmModule],
  controllers: [UserStatusController],
  providers: [UserStatusService],
})
export class UserStatusModule {}
