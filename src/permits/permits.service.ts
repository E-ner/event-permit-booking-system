// src/permits/permits.service.ts
import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permit } from './entities/permit.entity';
import { CreatePermitDto } from './dto/create-permit.dto';
import { UpdatePermitStatusDto } from './dto/update-permit.dto';
import { Booking } from '../bookings/entities/booking.entity';
import { RequestStatus } from 'src/common/enums/request-status.enum';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class PermitsService {
  constructor(
    @InjectRepository(Permit)
    private permitRepository: Repository<Permit>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
  ) {}

  async create(createDto: CreatePermitDto, user: any) {
    if (user.role !== UserRole.ORGANIZER) {
      throw new ForbiddenException('Only organizers can apply for permits');
    }

    const booking = await this.bookingRepository.findOne({
      where: { id: createDto.bookingId },
      relations: ['organizer'],
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.organizer.id !== user.userId) {
      throw new ForbiddenException(
        'You can only apply for permits on your own bookings',
      );
    }
    if (booking.status !== RequestStatus.APPROVED) {
      throw new ConflictException(
        'Permits can only be applied for approved bookings',
      );
    }

    const permit = this.permitRepository.create({
      ...createDto,
      booking,
      applicant: { id: user.userId },
    });

    return this.permitRepository.save(permit);
  }

  async findAll(user: any) {
    if (user.role === UserRole.AUTHORITY) {
      return this.permitRepository.find({
        relations: ['booking', 'booking.venue', 'applicant'],
        order: { createdAt: 'DESC' },
      });
    }

    // Organizer sees their own
    return this.permitRepository.find({
      where: { applicant: { id: user.userId } },
      relations: ['booking', 'booking.venue'],
    });
  }

  async findOne(id: string, user: any) {
    const permit = await this.permitRepository.findOne({
      where: { id },
      relations: ['booking', 'booking.venue', 'applicant'],
    });

    if (!permit) throw new NotFoundException('Permit not found');

    const isApplicant = permit.applicant.id === user.userId;
    const isAuthority = user.role === UserRole.AUTHORITY;

    if (!isApplicant && !isAuthority) {
      throw new ForbiddenException('No access to this permit');
    }

    return permit;
  }

  async updateStatus(id: string, dto: UpdatePermitStatusDto, user: any) {
    if (user.role !== UserRole.AUTHORITY) {
      throw new ForbiddenException('Only authorities can approve permits');
    }

    const permit = await this.findOne(id, user);
    if (permit.status !== RequestStatus.PENDING) {
      throw new ConflictException('Only pending permits can be updated');
    }

    permit.status = dto.status;
    permit.authorityNotes = dto.authorityNotes;

    return this.permitRepository.save(permit);
  }
}
