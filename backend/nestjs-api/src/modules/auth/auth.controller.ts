import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LocalGuard } from './guards/local.guard';
import { Request } from 'express';
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
  login(@Req() req: Request) {
    return { token: req.user };
  }

  @ApiOperation({ summary: 'Validate token' })
  @ApiResponse({ description: 'Token is valid' })
  @Get('validate')
  @UseGuards(JwtGuard)
  validateToken(@Req() req: Request) {
    return { message: 'Token is valid', user: req.user };
  }
}
