// src/users/dto/update-user.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsEmail,
  IsEnum,
  MinLength,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
    description: 'Updated username',
    example: 'john_doe_updated',
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({
    description: 'Updated email address (must be unique)',
    example: 'john.doe.new@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description:
      'New password (minimum 6 characters). Only provide if changing password.',
    example: 'newSecurePass123',
    minLength: 6,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional({
    description: 'Updated user role. Only AUTHORITY can change roles.',
    enum: UserRole,
    example: UserRole.ORGANIZER,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
