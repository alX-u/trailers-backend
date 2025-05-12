import { Module } from '@nestjs/common';
import { DriverService } from './driver.service';
import { DriverController } from './driver.controller';
import { Driver } from './entities/driver.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentModule } from '../document/document.module';

@Module({
  controllers: [DriverController],
  providers: [DriverService],
  imports: [TypeOrmModule.forFeature([Driver]), DocumentModule],
  exports: [TypeOrmModule, DriverService],
})
export class DriverModule {}
