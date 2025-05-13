import { Module } from '@nestjs/common';
import { ManpowerService } from './manpower.service';
import { ManpowerController } from './manpower.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Manpower } from './entities/manpower.entity';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [ManpowerController],
  providers: [ManpowerService],
  imports: [TypeOrmModule.forFeature([Manpower]), UserModule],
  exports: [TypeOrmModule, ManpowerService],
})
export class ManpowerModule {}
