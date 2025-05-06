import { Module } from '@nestjs/common';
import { ContractorService } from './contractor.service';
import { ContractorController } from './contractor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contractor } from './entities/contractor.entity';

@Module({
  controllers: [ContractorController],
  providers: [ContractorService],
  imports: [TypeOrmModule.forFeature([Contractor])],
})
export class ContractorModule {}
