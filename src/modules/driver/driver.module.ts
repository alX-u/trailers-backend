import { Module } from '@nestjs/common';
import { DriverService } from './driver.service';
import { DriverController } from './driver.controller';
import { Driver } from './entities/driver.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [DriverController],
  providers: [DriverService],
  imports: [TypeOrmModule.forFeature([Driver])],
})
export class DriverModule {}
