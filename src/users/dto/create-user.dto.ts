import { IsString, IsEmail, IsEnum, MinLength } from 'class-validator';
import { UserRole } from '../entities/user.entity'; // Assume enum is there
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Unique username',
    example: 'johnorganizer',
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'User email (must be unique)',
    example: 'organizer@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password (min 6 characters)',
    example: 'securepass123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'User role - restricted on public registration',
    enum: UserRole,
    example: UserRole.ORGANIZER,
  })
  @IsEnum(UserRole)
  role: UserRole;
}
