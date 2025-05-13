import { Module } from '@nestjs/common';
import { SparePartMaterialService } from './spare-part-material.service';
import { SparePartMaterialController } from './spare-part-material.controller';
import { SparePartMaterial } from './entities/spare-part-material.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProviderModule } from '../provider/provider.module';

@Module({
  controllers: [SparePartMaterialController],
  providers: [SparePartMaterialService],
  imports: [TypeOrmModule.forFeature([SparePartMaterial]), ProviderModule],
  exports: [TypeOrmModule, SparePartMaterialService],
})
export class SparePartMaterialModule {}
