import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
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
      const { documentType, documentNumber, role, userStatus, ...userDetails } =
        createUserDto;

      // Find the DocumentType entity
      const selectedDocumentType = await this.documentTypeRepository.findOneBy({
        idDocumentType: documentType,
      });

      if (!selectedDocumentType) {
        throw new BadRequestException(
          `DocumentType with ID ${documentType} not found`,
        );
      }

      // Find the Role entity
      const selectedRole = await this.roleRepository.findOneBy({
        idRole: role,
      });

      if (!selectedRole) {
        throw new BadRequestException(`Role with ID ${role} not found`);
      }

      // Find the UserStatus entity
      const selectedUserStatus = await this.userStatusRepository.findOneBy({
        idUserStatus: userStatus,
      });

      if (!selectedUserStatus) {
        throw new BadRequestException(
          `UserStatus with ID ${userStatus} not found`,
        );
      }

      //The idea is to send an email through sendgrid or some platform with a temp generated password
      // for the user. This is a placeholder for the actual implementation.
      const tempPassword = 'tempPassword';

      // Create a new User instance
      const newUser = this.userRepository.create({
        ...userDetails,
        role: selectedRole,
        password: tempPassword,
        userStatus: selectedUserStatus,
        document: {
          documentType: selectedDocumentType,
          documentNumber: documentNumber,
        },
      });

      // Save the user (this will also save the document due to cascade)
      return await this.userRepository.save(newUser);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async getUsers({ limit, offset }: { limit?: number; offset?: number }) {
    // Set default values if not provided
    const take = limit ?? 10;
    const skip = offset ?? 0;

    try {
      const [users, total] = await this.userRepository.findAndCount({
        take,
        skip,
        order: { createdAt: 'DESC' },
        relations: ['role', 'userStatus', 'document'],
      });

      return {
        data: users,
        total,
        limit: take,
        offset: skip,
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async getUserById(id: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { idUser: id },
        relations: ['role', 'userStatus', 'document'],
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return user;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    try {
      // Find the existing user
      const user = await this.userRepository.findOne({
        where: { idUser: id },
        relations: ['role', 'userStatus', 'document'],
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      // Update scalar fields if provided
      if (updateUserDto.firstName !== undefined)
        user.firstName = updateUserDto.firstName;
      if (updateUserDto.lastName !== undefined)
        user.lastName = updateUserDto.lastName;
      if (updateUserDto.email !== undefined) user.email = updateUserDto.email;
      if (updateUserDto.phone !== undefined) user.phone = updateUserDto.phone;
      if (updateUserDto.password !== undefined)
        user.password = updateUserDto.password;

      // Update role if provided
      if (updateUserDto.role) {
        const selectedRole = await this.roleRepository.findOneBy({
          idRole: updateUserDto.role,
        });
        if (!selectedRole) {
          throw new BadRequestException(
            `Role with ID ${updateUserDto.role} not found`,
          );
        }
        user.role = selectedRole;
      }

      // Update userStatus if provided
      if (updateUserDto.userStatus) {
        const selectedUserStatus = await this.userStatusRepository.findOneBy({
          idUserStatus: updateUserDto.userStatus,
        });
        if (!selectedUserStatus) {
          throw new BadRequestException(
            `UserStatus with ID ${updateUserDto.userStatus} not found`,
          );
        }
        user.userStatus = selectedUserStatus;
      }

      // Update document if provided
      if (updateUserDto.documentType || updateUserDto.documentNumber) {
        // If user has a document, update it; otherwise, create a new one
        let document = user.document;
        if (!document) {
          document = this.documentRepository.create();
        }
        if (updateUserDto.documentType) {
          const selectedDocumentType =
            await this.documentTypeRepository.findOneBy({
              idDocumentType: updateUserDto.documentType,
            });
          if (!selectedDocumentType) {
            throw new BadRequestException(
              `DocumentType with ID ${updateUserDto.documentType} not found`,
            );
          }
          document.documentType = selectedDocumentType;
        }
        if (updateUserDto.documentNumber !== undefined) {
          document.documentNumber = updateUserDto.documentNumber;
        }
        user.document = document;
      }

      // Save the updated user (cascades to document if needed)
      const updatedUser = await this.userRepository.save(user);

      return updatedUser;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async deleteUser(id: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { idUser: id },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      await this.userRepository.remove(user);

      return {
        message: `User with ID ${id} has been deleted successfully.`,
        user,
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check logs');
  }
}
