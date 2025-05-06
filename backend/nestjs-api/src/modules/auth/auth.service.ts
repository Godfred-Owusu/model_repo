import {
  BadRequestException,
  Body,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/users.schema';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private user: Model<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
  ) {}
  async validateUser(@Body() loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.user.findOne({ email });
    if (!user) {
      return null;
    }
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }
    const { password: _, ...userWithoutPassword } = user.toObject();
    // return this.jwtService.sign(userWithoutPassword);
    return this.jwtService.signAsync({ id: user._id });
  }

  // find user by id
  async findUserById(id: string) {
    const user = await this.user.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    const { password: _, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  }

  // get user through jwt
  async getUserFromJwt(id: string) {
    try {
      const data = await this.jwtService.verifyAsync(id);
      if (!data) throw new UnauthorizedException('Invalid token');
      const user = await this.findUserById(data.id);
      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async getemailFromJwt(id: string) {
    try {
      const data = await this.jwtService.verifyAsync(id);
      if (!data) throw new UnauthorizedException('Invalid token');

      const userdata = await this.findUserById(data.id);
      if (!userdata) throw new UnauthorizedException('User not found');

      // Generate token and expiry
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const verificationTokenExpires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
      const frontendLink = this.configService.get<string>('APP_URL');
      const verificationLink = `${frontendLink}/verify-email?token=${verificationToken}`;

      // Update user directly in DB
      await this.user.updateOne(
        { _id: userdata._id },
        {
          verificationToken,
          verificationTokenExpires,
          isVerified: false,
        },
      );

      // Send verification email
      await this.emailService.verifyEmail(
        userdata.firstName,
        userdata.email,
        verificationLink,
      );

      return { message: 'Email sent successfully' };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  //   const user = await this.user.findOne({ email });
  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }
  //   if (user.isVerified) {
  //     throw new ConflictException('User is already verified');
  //   }
  //   return this.user.updateOne({ email }, { isVerified: true });
  // }
}
