// src/permits/permits.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PermitsService } from './permits.service';
import { CreatePermitDto } from './dto/create-permit.dto';
import { UpdatePermitStatusDto } from './dto/update-permit.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiCreatedResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Permits')
@ApiBearerAuth('JWT-auth')
@Controller('permits')
@UseGuards(AuthGuard('jwt'))
export class PermitsController {
  constructor(private readonly permitsService: PermitsService) {}

  @Post()
  @Roles(UserRole.ORGANIZER)
  @ApiOperation({
    summary: 'Apply for event permit',
    description: `
**ORGANIZER only**

Apply for regulatory permits linked to an **APPROVED** booking.

Multiple permits can be applied per booking (e.g., noise, safety, alcohol).

Required for compliance with RDB and local regulations.
    `,
  })
  @ApiCreatedResponse({ description: 'Permit application submitted (PENDING)' })
  @ApiConflictResponse({
    description: 'Booking must be APPROVED before applying for permits',
  })
  @ApiForbiddenResponse({ description: 'Only booking organizer can apply' })
  create(@Body() createDto: CreatePermitDto, @Request() req) {
    return this.permitsService.create(createDto, req.user);
  }

  @Get()
  @ApiOperation({
    summary: 'Permit dashboard',
    description: `
- **ORGANIZER**: Their own permit applications
- **AUTHORITY**: All applications (pending and processed)
    `,
  })
  findAll(@Request() req) {
    return this.permitsService.findAll(req.user);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'View permit details',
    description: 'Accessible by applicant or authority',
  })
  findOne(@Param('id') id: string, @Request() req) {
    return this.permitsService.findOne(id, req.user);
  }

  @Patch(':id/status')
  @Roles(UserRole.AUTHORITY)
  @ApiOperation({
    summary: 'Approve or reject permit',
    description: `
**AUTHORITY only**

Final compliance decision. Can include official notes.

Supports Rwanda regulatory requirements (noise, safety, public health).
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Permit status updated with optional notes',
  })
  @ApiConflictResponse({ description: 'Only pending permits can be updated' })
  @ApiForbiddenResponse({ description: 'Only AUTHORITY can approve permits' })
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdatePermitStatusDto,
    @Request() req,
  ) {
    return this.permitsService.updateStatus(id, dto, req.user);
  }
}
