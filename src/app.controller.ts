// src/app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';

@ApiTags('Home')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'System status and information',
    description:
      'Welcome endpoint providing system overview, status, and quick links.',
  })
  @ApiResponse({
    status: 200,
    description: 'System information and API links',
  })
  getHome() {
    return this.appService.getHome();
  }

  // Optional: Hide default hello if you want
  @Get('hello')
  @ApiExcludeEndpoint() // Hides from Swagger
  getHello() {
    return this.appService.getHello();
  }
}
