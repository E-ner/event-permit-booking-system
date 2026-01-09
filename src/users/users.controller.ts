// src/users/users.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from './entities/user.entity';
import {
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
  ApiCreatedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';

@ApiTags('Users Management')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Public: Anyone can register as ORGANIZER
  @Post('register')
  @ApiOperation({
    summary: 'Public registration',
    description:
      'Anyone can register as an ORGANIZER. Self-registration for VENUE_MANAGER or AUTHORITY is blocked for security.',
  })
  @ApiCreatedResponse({
    description: 'User successfully registered as ORGANIZER',
  })
  @ApiResponse({ status: 409, description: 'Email or username already exists' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto, false);
  }

  // Only AUTHORITY can create restricted roles
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOperation({
    summary: 'Admin creates user (restricted)',
    description:
      'Only AUTHORITY can create VENUE_MANAGER or AUTHORITY accounts. Used for secure onboarding.',
  })
  @ApiCreatedResponse({ description: 'User created (any role)' })
  @ApiForbiddenResponse({
    description: 'Only AUTHORITY can create restricted roles',
  })
  @Post('create')
  adminCreate(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto, true);
  }

  // Only AUTHORITY can list all users
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.AUTHORITY)
  @Get()
  @ApiOperation({
    summary: 'List all users',
    description: 'Full user list with roles. AUTHORITY only.',
  })
  @ApiResponse({ status: 200, description: 'List of all users' })
  @ApiForbiddenResponse({ description: 'Only AUTHORITY can view all users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  @ApiOperation({
    summary: 'Getting user profile',
    description: 'Full user list with roles. AUTHORITY only.',
  })
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Request() req) {
    return req.user;
  }

  // Only AUTHORITY can view a specific user
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.AUTHORITY)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  // Only AUTHORITY can update any user
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.AUTHORITY)
  @ApiOperation({
    summary: 'Admin updates user (restricted)',
    description:
      'Only AUTHORITY can update VENUE_MANAGER or AUTHORITY accounts. Used for secure onboarding.',
  })
  @ApiCreatedResponse({ description: 'User updated (any role)' })
  @ApiForbiddenResponse({
    description: 'Only AUTHORITY can update restricted roles',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  // Only AUTHORITY can delete users
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.AUTHORITY)
  @ApiOperation({
    summary: 'Admin deletes user (restricted)',
    description:
      'Only AUTHORITY can delete VENUE_MANAGER or AUTHORITY accounts. Used for secure onboarding.',
  })
  @ApiCreatedResponse({ description: 'User delete (any role)' })
  @ApiForbiddenResponse({
    description: 'Only AUTHORITY can delete restricted roles',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
