import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
@ApiOperation({
    summary: 'User login',
    description: 'Authenticate with email and password to receive a JWT token. Token expires in 1 hour.',
  })
  @ApiBody({
    type: LoginUserDto,
    description: 'Login credentials',
    examples: {
      organizer: {
        value: {
          email: 'organizer@example.com',
          password: 'orgpass123',
        },
        summary: 'Organizer login',
      },
      authority: {
        value: {
          email: 'admin@example.com',
          password: 'admin123',
        },
        summary: 'Authority login',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx',
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
}