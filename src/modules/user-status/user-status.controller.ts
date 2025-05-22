import { Controller, Get } from '@nestjs/common';
import { UserStatusService } from './user-status.service';

@Controller('user-status')
export class UserStatusController {
  constructor(private readonly userStatusService: UserStatusService) {}
  @Get()
  getAllUserStatus() {
    return this.userStatusService.getAllUserStatus();
  }
}
