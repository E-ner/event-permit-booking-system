// src/venues/venues.service.ts
import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Venue } from './entities/venue.entity';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { SearchVenuesDto } from './dto/search-venues.dto';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class VenuesService {
  constructor(
    @InjectRepository(Venue)
    private venueRepository: Repository<Venue>,
  ) {}

  // Create venue — only VENUE_MANAGER, auto-assign ownership
  async create(createVenueDto: CreateVenueDto, user: any) {
    if (user.role !== UserRole.VENUE_MANAGER) {
      throw new ForbiddenException('Only venue managers can create venues');
    }

    const venue = this.venueRepository.create({
      ...createVenueDto,
      manager: { id: user.userId }, // from JWT
    });

    return this.venueRepository.save(venue);
  }

  // Public search with optional geolocation
  // src/venues/venues.service.ts - Updated search method
  async search(searchDto: SearchVenuesDto) {
    const query = this.venueRepository.createQueryBuilder('venue');

    if (searchDto.keyword) {
      query.andWhere(
        '(venue.name ILIKE :keyword OR venue.address ILIKE :keyword)',
        {
          keyword: `%${searchDto.keyword}%`,
        },
      );
    }

    if (searchDto.lat && searchDto.long && searchDto.radiusKm) {
      const earthRadiusKm = 6371; // Earth's radius in kilometers
      const maxDistanceKm = searchDto.radiusKm;

      // Haversine formula in raw SQL
      query.andWhere(
        `
      (${earthRadiusKm} * acos(
        cos(radians(:lat)) *
        cos(radians(venue.latitude)) *
        cos(radians(venue.longitude) - radians(:long)) +
        sin(radians(:lat)) *
        sin(radians(venue.latitude))
      )) <= :maxDistance
    `,
        {
          lat: searchDto.lat,
          long: searchDto.long,
          maxDistance: maxDistanceKm,
        },
      );
    }

    // Optional: Order by distance if geolocation is used
    if (searchDto.lat && searchDto.long) {
      query
        .orderBy(
          `
      (6371 * acos(
        cos(radians(:lat)) *
        cos(radians(venue.latitude)) *
        cos(radians(venue.longitude) - radians(:long)) +
        sin(radians(:lat)) *
        sin(radians(venue.latitude))
      ))
    `,
          'ASC',
        )
        .setParameter('lat', searchDto.lat)
        .setParameter('long', searchDto.long);
    }

    return query.getMany();
  }

  // Get all (admin only) or manager's own venues
  async findAll(user: any) {
    if (user.role === UserRole.AUTHORITY) {
      return this.venueRepository.find({ relations: ['manager'] });
    }

    if (user.role == UserRole.VENUE_MANAGER) {    
      return this.venueRepository.find({
        where: { manager: { id: user.userId } },
        relations: ['manager'],
      });
    }
    else { return this.venueRepository.find() }
  }

  async findOne(id: string, user?: any) {
    const venue = await this.venueRepository.findOne({
      where: { id },
      relations: ['manager'],
    });

    if (!venue) throw new NotFoundException('Venue not found');

    // If user provided, check ownership for sensitive actions
    if (
      user &&
      venue.manager.id !== user.userId &&
      user.role !== UserRole.AUTHORITY
    ) {
      throw new ForbiddenException('You can only view your own venues');
    }

    return venue;
  }

  async update(id: string, updateVenueDto: UpdateVenueDto, user: any) {
    const venue = await this.findOne(id, user); // Reuses ownership check

    Object.assign(venue, updateVenueDto);
    return this.venueRepository.save(venue);
  }

  async remove(id: string, user: any) {
    const venue = await this.findOne(id, user);
    return this.venueRepository.remove(venue);
  }
}
