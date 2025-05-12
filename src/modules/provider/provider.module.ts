import { Module } from '@nestjs/common';
import { ProviderService } from './provider.service';
import { ProviderController } from './provider.controller';
import { Provider } from './entities/provider.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentTypeModule } from '../document-type/document-type.module';
import { DocumentModule } from '../document/document.module';

@Module({
  controllers: [ProviderController],
  providers: [ProviderService],
  imports: [
    TypeOrmModule.forFeature([Provider]),
    DocumentTypeModule,
    DocumentModule,
  ],
  exports: [TypeOrmModule, ProviderService],
})
export class ProviderModule {}
