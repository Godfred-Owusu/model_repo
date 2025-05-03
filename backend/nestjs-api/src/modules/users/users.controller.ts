import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.schema';
import { UserDto } from './dtos/create-user.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { Request } from 'express';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Get all users',
    type: UserDto,
  })
  async getAllUsers() {
    return this.usersService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: UserDto,
  })
  async createUser(@Body() userDto: UserDto): Promise<User> {
    return this.usersService.createUser(userDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({
    description: 'User ID to delete',
    type: String,
    name: 'id',
  })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async deleteUser(@Body('id') id: string): Promise<User | null> {
    return this.usersService.deleteUser(id);
  }

  @UseGuards(JwtGuard)
  @Get('status')
  @ApiOperation({ summary: 'Get user status' })
  @ApiResponse({
    status: 200,
    description: 'Get user status',
  })
  async getUserStatus(@Req() req: Request) {
    console.log(req.user);
    return 'User status: OK';
  }
}
