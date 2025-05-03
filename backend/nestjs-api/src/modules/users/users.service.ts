import { Body, ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './users.schema';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { UserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private user: Model<User>) {}

  async createUser(@Body() userDto: UserDto): Promise<User> {
    const { password, email, ...userData } = userDto;
    const existingUser = await this.user.findOne({ email });
    // Check if user already exists
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    // Hash the password here if needed
    const hashedPassword = await bcrypt.hash(password, 10);
    userDto.password = hashedPassword;
    const createdUser = await new this.user(userDto);
    const savedUser = await createdUser.save();
    // Remove sensitive data before returning the user object
    const { password: _, ...userWithoutPassword } = savedUser.toObject();
    return savedUser;
  }

  async findAll(): Promise<User[]> {
    return this.user
      .find()
      .select(
        '-password -passwordResetToken -verificationToken -passwordResetExpires',
      )
      .exec();
  }

  async findOneById(id: string): Promise<User | null> {
    const user = await this.user.findById(id).exec();
    return user;
  }
}
