import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { Client } from './entities/client.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentTypeModule } from '../document-type/document-type.module';
import { DocumentModule } from '../document/document.module';

@Module({
  controllers: [ClientController],
  providers: [ClientService],
  imports: [
    TypeOrmModule.forFeature([Client]),
    DocumentTypeModule,
    DocumentModule,
  ],
  exports: [TypeOrmModule, ClientService],
})
export class ClientModule {}
