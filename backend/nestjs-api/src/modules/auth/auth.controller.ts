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
    if (!user) {
      throw new NotFoundException('Account not found, please register');
    }
    response.cookie('token', req.user, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });
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
  async getUserFromCookie(@Req() req: Request) {
    const cookie = req.cookies['token'];
    return this.authService.getUserFromJwt(cookie);
  }

  // is userVerified
  @ApiOperation({ summary: 'Check if user is verified' })
  @ApiResponse({ description: 'User is verified' })
  @Get('is-user-verified')
  async isUserVerified(@Req() req: Request) {
    const cookie = req.cookies['token'];
    const user = await this.authService.getUserFromJwt(cookie);
    if (!user.isVerified) return { status: false };
    return { status: true };
  }

  @Get('get-email')
  async getemailFromCookie(@Req() req: Request) {
    const cookie = req.cookies['token'];
    return this.authService.getemailFromJwt(cookie);
  }

  @ApiOperation({ summary: 'Logout user' })
  @Get('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('token');
    return { message: 'Logout successful' };
  }
}
