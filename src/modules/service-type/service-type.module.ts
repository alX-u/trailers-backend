import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceType } from './entities/service-type.entity';

@Module({ imports: [TypeOrmModule.forFeature([ServiceType])] })
export class ServiceTypeModule {}
