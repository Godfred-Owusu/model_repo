import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LocalGuard } from './guards/local.guard';
import { Request, Response } from 'express';
import { JwtGuard } from './guards/jwt.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //   @ApiOperation({ summary: 'Login user' })
  //   @ApiBody({
  //     type: LoginDto,
  //     description: 'User login credentials',
  //   })
  //   @Post('login')
  //   @UseGuards(LocalGuard)
  //   login(@Body() loginDto: LoginDto) {
  //     const user = this.authService.validateUser(loginDto);
  //     if (!user) {
  //       throw new NotFoundException('User not found');
  //     }
  //     return user;
  //   }

  @ApiOperation({ summary: 'Login user' })
  @ApiBody({
    type: LoginDto,
    description: 'User login credentials',
  })
  @Post('login')
  @UseGuards(LocalGuard)
  login(@Req() req: Request, @Res({ passthrough: true }) response: Response) {
    const user = req.user;
    response.cookie('token', req.user, { httpOnly: true, secure: true });
    return { message: 'Login successful' };
  }

  @ApiOperation({ summary: 'Validate token' })
  @ApiResponse({ description: 'Token is valid' })
  @Get('validate')
  @UseGuards(JwtGuard)
  validateToken(@Req() req: Request) {
    return { message: 'Token is valid', user: req.user };
  }

  @Get('user')
  async getUser(@Req() req: Request) {
    const cookie = req.cookies['token'];
    return this.authService.getUser(cookie);
  }

  // is userVerified
  @Get('is-user-verified')
  async isUserVerified(@Req() req: Request) {
    const cookie = req.cookies['token'];
    const user = await this.authService.getUser(cookie);
    if (!user.isVerified) return { message: 'User is not verified' };
    return { message: 'User is verified' };
  }

  @ApiOperation({ summary: 'Logout user' })
  @Get('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('token');
    return { message: 'Logout successful' };
  }
}
