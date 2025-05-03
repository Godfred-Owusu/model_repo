import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Min } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Users email',
    example: 'k8v4P@example.com',
  })
  @IsString({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email is not valid' })
  email: string;

  @ApiProperty({
    description: 'Users password',
    example: '123456',
  })
  @IsString({ message: 'Password is required' })
  @Min(6, { message: 'Password must be at least 6 characters' })
  password: string;
}
