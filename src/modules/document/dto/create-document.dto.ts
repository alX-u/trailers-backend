import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateDocumentDto {
  @IsNotEmpty()
  @IsUUID()
  document_type: string;

  @IsNotEmpty()
  @IsString()
  document_number: string;
}
