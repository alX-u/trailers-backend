import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { DocumentTypeModule } from '../document-type/document-type.module';

@Module({
  controllers: [DocumentController],
  providers: [DocumentService],
  imports: [TypeOrmModule.forFeature([Document]), DocumentTypeModule],
  exports: [TypeOrmModule, DocumentService],
})
export class DocumentModule {}
