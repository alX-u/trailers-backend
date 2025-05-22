import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserStatus } from './entities/user-status.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserStatusService {
  constructor(
    @InjectRepository(UserStatus)
    private readonly userStatusRepository: Repository<UserStatus>,
  ) {}
  async getAllUserStatus() {
    return await this.userStatusRepository.find();
  }
}
