import {
  Body,
  ConflictException,
  Injectable,
  NotFoundException,
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
      throw new ConflictException('Invalid credentials');
    }
    const { password: _, ...userWithoutPassword } = user.toObject();
    return this.jwtService.sign(userWithoutPassword);
  }
}
