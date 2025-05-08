import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Document } from '../document/entities/document.entity';
import { DocumentType } from '../document-type/entities/document-type.entity';
import { Role } from '../role/entities/role.entity';
import { UserStatus } from '../user-status/entities/user-status.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger('UserService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    @InjectRepository(DocumentType)
    private readonly documentTypeRepository: Repository<DocumentType>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(UserStatus)
    private readonly userStatusRepository: Repository<UserStatus>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    try {
      const {
        document_type,
        document_number,
        role,
        user_status,
        ...userDetails
      } = createUserDto;

      // Find the DocumentType entity
      const selectedDocumentType = await this.documentTypeRepository.findOneBy({
        id_document_type: document_type,
      });

      if (!selectedDocumentType) {
        throw new BadRequestException(
          `DocumentType with ID ${document_type} not found`,
        );
      }

      // Find the Role entity
      const selectedRole = await this.roleRepository.findOneBy({
        id_role: role,
      });

      if (!selectedRole) {
        throw new BadRequestException(`Role with ID ${role} not found`);
      }

      // Find the UserStatus entity
      const selectedUserStatus = await this.userStatusRepository.findOneBy({
        id_user_status: user_status,
      });

      if (!selectedUserStatus) {
        throw new BadRequestException(
          `UserStatus with ID ${user_status} not found`,
        );
      }

      // Create a new User instance
      const newUser = this.userRepository.create({
        ...userDetails,
        role: selectedRole,
        userStatus: selectedUserStatus,
        document: {
          document_type: selectedDocumentType,
          document_number: document_number,
        },
      });

      // Save the user (this will also save the document due to cascade)
      return await this.userRepository.save(newUser);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  getUsers({ limit, offset }: { limit?: number; offset?: number }) {
    return `This action returns all user`;
  }

  getUserById(id: string) {
    return `This action returns a #${id} user`;
  }

  updateUser(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  deleteUser(id: string) {
    return `This action removes a #${id} user`;
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check logs');
  }
}
