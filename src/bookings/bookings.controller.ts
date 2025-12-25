// src/bookings/bookings.controller.ts
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
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiCreatedResponse, ApiConflictResponse, ApiForbiddenResponse, ApiResponse } from '@nestjs/swagger';


@ApiTags('Bookings')
@ApiBearerAuth('JWT-auth')
@Controller('bookings')
@UseGuards(AuthGuard('jwt'))
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @Roles(UserRole.ORGANIZER)
  @ApiOperation({
    summary: 'Create booking request',
    description: `
**ORGANIZER only**

Submits a booking request for a venue on specific dates.

- Automatic conflict detection against APPROVED bookings
- Status set to PENDING
- Venue manager must approve
    `,
  })
  @ApiCreatedResponse({ description: 'Booking request created (PENDING)' })
  @ApiConflictResponse({ description: 'Venue already booked on these dates' })
  @ApiForbiddenResponse({ description: 'Only ORGANIZER can request bookings' })
  create(@Body() createDto: CreateBookingDto, @Request() req) {
    return this.bookingsService.create(createDto, req.user);
  }

  @Get()
  @ApiOperation({
    summary: 'Bookings dashboard',
    description: `
Role-based view:
- **ORGANIZER**: Their own booking requests
- **VENUE_MANAGER**: All requests for venues they manage
- **AUTHORITY**: Full system view
    `,
  })
  findAll(@Request() req) {
    return this.bookingsService.findAll(req.user);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'View booking details',
    description: 'Accessible by organizer, venue manager, or authority',
  })
  findOne(@Param('id') id: string, @Request() req) {
    return this.bookingsService.findOne(id, req.user);
  }

  @Patch(':id/status')
  @Roles(UserRole.VENUE_MANAGER, UserRole.AUTHORITY)
  @ApiOperation({
    summary: 'Approve or reject booking',
    description: `
Only the VENUE_MANAGER of the booked venue (or AUTHORITY) can change status.

Only PENDING bookings can be updated.
    `,
  })
  @ApiResponse({ status: 200, description: 'Booking status updated' })
  @ApiConflictResponse({ description: 'Only pending bookings can be updated' })
  @ApiForbiddenResponse({ description: 'Not authorized to approve this booking' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateBookingStatusDto,
    @Request() req,
  ) {
    return this.bookingsService.updateStatus(id, updateDto, req.user);
  }
}