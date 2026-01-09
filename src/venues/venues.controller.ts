// src/venues/venues.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { VenuesService } from './venues.service';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { SearchVenuesDto } from './dto/search-venues.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';

@ApiTags('Venues')
@ApiBearerAuth('JWT-auth')
@Controller('venues')
export class VenuesController {
  constructor(private readonly venuesService: VenuesService) {}

  // Public search — anyone can discover venues
  @Get('search')
  @ApiOperation({
    summary: 'Public venue search with geolocation',
    description:
      'Search venues by keyword and/or proximity. Uses Haversine formula for accurate distance calculation. Results sorted by distance when geolocation is used.',
  })
  @ApiQuery({
    name: 'keyword',
    required: false,
    type: String,
    description: 'Search in name or address',
  })
  @ApiQuery({
    name: 'lat',
    required: false,
    type: Number,
    description: 'Latitude for proximity search',
  })
  @ApiQuery({
    name: 'long',
    required: false,
    type: Number,
    description: 'Longitude',
  })
  @ApiQuery({
    name: 'radiusKm',
    required: false,
    type: Number,
    description: 'Search radius in kilometers (default 10)',
  })
  @ApiResponse({ status: 200, description: 'List of matching venues' })
  search(@Query() searchDto: SearchVenuesDto) {
    return this.venuesService.search(searchDto);
  }

  // Protected: Only venue manager creates
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.VENUE_MANAGER)
  @Post()
  @Roles(UserRole.VENUE_MANAGER)
  @ApiOperation({
    summary: 'Create a new venue',
    description:
      'Only VENUE_MANAGER can create venues. Ownership is automatically assigned.',
  })
  @ApiCreatedResponse({ description: 'Venue created successfully' })
  @ApiForbiddenResponse({ description: 'Only VENUE_MANAGER can create venues' })
  create(@Body() createVenueDto: CreateVenueDto, @Request() req) {
    return this.venuesService.create(createVenueDto, req.user);
  }

  // Admin sees all, manager sees own
  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiOperation({
    summary: 'List venues',
    description: `
- Public/ORGANIZER: All venues
- VENUE_MANAGER: Only their managed venues
- AUTHORITY: All venues
    `,
  })
  findAll(@Request() req) {
    return this.venuesService.findAll(req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get venue by ID', description: 'Public access' })
  findOne(@Param('id') id: string) {
    return this.venuesService.findOne(id); // Public read
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.VENUE_MANAGER)
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.VENUE_MANAGER)
  @ApiOperation({ summary: 'Update own venue' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateVenueDto: UpdateVenueDto,
    @Request() req,
  ) {
    return this.venuesService.update(id, updateVenueDto, req.user);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.VENUE_MANAGER)
  @Delete(':id')
  @Roles(UserRole.VENUE_MANAGER)
  @ApiOperation({ summary: 'Delete own venue' })
  remove(@Param('id') id: string, @Request() req) {
    return this.venuesService.remove(id, req.user);
  }
}
