import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateDocumentDto {
  @IsNotEmpty()
  @IsUUID()
  documentType: string;

  @IsNotEmpty()
  @IsString()
  documentNumber: string;
}
