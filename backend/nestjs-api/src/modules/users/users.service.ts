import {
  BadRequestException,
  Body,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './users.schema';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { UserDto } from './dtos/create-user.dto';
import { EmailService } from '../email/email.service';
import * as crypto from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private user: Model<User>,
    private emailService: EmailService,
  ) {}

  async createUser(@Body() userDto: UserDto): Promise<any> {
    const { password, email, ...userData } = userDto;

    const existingUser = await this.user.findOne({ email });
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await this.emailService.verifyEmail(
      userDto.firstName,
      email,
      verificationToken,
    );

    // Create and save the new user
    const newUser = new this.user({
      ...userData,
      email,
      password: hashedPassword,
      isVerified: false,
      verificationToken,
      verificationTokenExpires,
    });

    const savedUser = await newUser.save();

    // Remove sensitive data before returning
    const {
      password: _,
      verificationToken: __,
      ...userWithoutSensitive
    } = savedUser.toObject();

    return userWithoutSensitive;
  }

  async verifyEmailToken(token: string) {
    const user = await this.user.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    return { message: 'Email verified successfully' };
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
  async deleteUser(id: string): Promise<User> {
    const deletedUser = await this.user.findByIdAndDelete(id).exec();

    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return deletedUser;
  }
}
