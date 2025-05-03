import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsString, MinLength } from 'class-validator';

export class UserDto {
  @ApiProperty({ description: 'Users first name', example: 'John' })
  @IsString()
  @MinLength(2, {
    message:
      'First name is too short. Minimal length is $constraint1 characters, but actual is $value',
  })
  firstName: string;

  @ApiProperty({ description: 'Users last name', example: 'Doe' })
  @IsString()
  @MinLength(2, {
    message:
      'Last name is too short. Minimal length is $constraint1 characters, but actual is $value',
  })
  lastName: string;

  @ApiProperty({ description: 'Users email', example: 'k8v4P@example.com' })
  @IsString()
  @IsEmail(
    {},
    {
      message: 'Email is not valid',
    },
  )
  email: string;

  @ApiProperty({ description: 'Users password', example: '123456' })
  @IsString()
  @MinLength(6, {
    message:
      'Password is too short. Minimal length is $constraint1 characters, but actual is $value',
  })
  password: string;

  //   @ApiProperty({ description: 'is user verified', example: 'false' })
  //     @IsBoolean()
  //   isVerified: boolean;

  //   @ApiProperty({ description: 'password reset token', example: '123456' })
  //   @IsString()
  //   passwordResetToken: string;

  //   @ApiProperty({
  //     description: 'password reset token expiry',
  //     example: '2023-10-01T00:00:00Z',
  //   })
  //   @IsString()
  //   passwordResetTokenExpiry: string;
}
