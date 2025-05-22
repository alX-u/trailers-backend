import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentType as DocumentType } from './entities/document-type.entity';
import { DocumentTypeController } from './document-type.controller';
import { DocumentTypeService } from './document-type.service';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentType])],
  exports: [TypeOrmModule],
  controllers: [DocumentTypeController],
  providers: [DocumentTypeService],
})
export class DocumentTypeModule {}
