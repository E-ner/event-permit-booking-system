// src/bookings/bookings.service.ts
import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking.dto';
import { Venue } from '../venues/entities/venue.entity';
import { UserRole } from '../users/entities/user.entity';
import { RequestStatus } from 'src/common/enums/request-status.enum';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Venue)
    private venueRepository: Repository<Venue>,
  ) {}

  // Organizer creates booking request
  async create(createDto: CreateBookingDto, user: any) {
    if (user.role !== UserRole.ORGANIZER) {
      throw new ForbiddenException('Only organizers can request bookings');
    }

    const venue = await this.venueRepository.findOne({
      where: { id: createDto.venueId },
      relations: ['manager'],
    });

    if (!venue) {
      throw new NotFoundException('Venue not found');
    }

    // Conflict detection: check overlapping APPROVED bookings
    const conflict = await this.bookingRepository.findOne({
      where: [
        {
          venue: { id: venue.id },
          startDate: Between(new Date(createDto.startDate), new Date(createDto.endDate)),
          status: RequestStatus.APPROVED,
        },
        {
          venue: { id: venue.id },
          endDate: Between(new Date(createDto.startDate), new Date(createDto.endDate)),
          status: RequestStatus.APPROVED,
        },
        {
          venue: { id: venue.id },
          startDate: new Date(createDto.startDate),
          endDate: new Date(createDto.endDate),
          status: RequestStatus.APPROVED,
        },
      ],
    });

    if (conflict) {
      throw new ConflictException(
        'This venue is already booked for the selected dates',
      );
    }

    const booking = this.bookingRepository.create({
      ...createDto,
      startDate: new Date(createDto.startDate),
      endDate: new Date(createDto.endDate),
      venue,
      organizer: { id: user.userId },
      status: RequestStatus.PENDING,
    });

    return this.bookingRepository.save(booking);
  }

  // Dashboard views
  async findAll(user: any) {
    if (user.role === UserRole.AUTHORITY) {
      return this.bookingRepository.find({
        relations: ['venue', 'venue.manager', 'organizer'],
        order: { createdAt: 'DESC' },
      });
    }

    if (user.role === UserRole.VENUE_MANAGER) {
      return this.bookingRepository.find({
        where: { venue: { manager: { id: user.userId } } },
        relations: ['venue', 'organizer'],
        order: { createdAt: 'DESC' },
      });
    }

    // Organizer sees their own bookings
    return this.bookingRepository.find({
      where: { organizer: { id: user.userId } },
      relations: ['venue'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, user: any) {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['venue', 'venue.manager', 'organizer'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const isOrganizer = booking.organizer.id === user.userId;
    const isVenueManager = booking.venue.manager.id === user.userId;
    const isAuthority = user.role === UserRole.AUTHORITY;

    if (!isOrganizer && !isVenueManager && !isAuthority) {
      throw new ForbiddenException('You do not have permission to view this booking');
    }

    return booking;
  }

  // Only venue manager can approve/reject
  async updateStatus(id: string, dto: UpdateBookingStatusDto, user: any) {
    const booking = await this.findOne(id, user);

    if (booking.status !== RequestStatus.PENDING) {
      throw new ConflictException('Only pending bookings can be updated');
    }

    const isVenueManager = booking.venue.manager.id === user.userId;
    const isAuthority = user.role === UserRole.AUTHORITY;

    if (!isVenueManager && !isAuthority) {
      throw new ForbiddenException('Only the venue manager can approve/reject bookings');
    }

    booking.status = dto.status;
    return this.bookingRepository.save(booking);
  }
}