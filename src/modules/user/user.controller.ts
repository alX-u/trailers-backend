import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Create a new user
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  // Get a list of users
  @Get()
  getUsers(@Query('limit') limit?: number, @Query('offset') offset?: number) {
    return this.userService.getUsers({ limit, offset });
  }

  // Get a single user by ID

  @Get(':id')
  getUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.getUserById(id);
  }

  @Get('document/:documentNumber')
  getUserByDocumentNumber(@Param('documentNumber') documentNumber: string) {
    return this.userService.getUserByDocumentNumber(documentNumber);
  }

  @Get('filter')
  async getUserByFilter(@Query() query: any) {
    return this.userService.getUserByFilter(query);
  }

  // Update a user by ID
  @Patch(':id')
  updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  // Delete a user by ID
  @Delete(':id')
  softDeleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.softDeleteUser(id);
  }
}
