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

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private user: Model<User>,
    private jwtService: JwtService,
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
  async getUser(id: string) {
    try {
      const data = await this.jwtService.verifyAsync(id);
      if (!data) throw new UnauthorizedException('Invalid token');
      const user = await this.findUserById(data.id);
      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
