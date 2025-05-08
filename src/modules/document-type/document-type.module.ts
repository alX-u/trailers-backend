import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentType as DocumentType } from './entities/document-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentType])],
  exports: [TypeOrmModule],
})
export class DocumentTypeModule {}
