// src/bookings/entities/booking.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { RequestStatus } from 'src/common/enums/request-status.enum';
import { Permit } from 'src/permits/entities/permit.entity';
import { User } from 'src/users/entities/user.entity';
import { Venue } from 'src/venues/entities/venue.entity';

@Entity('bookings')
@Index(['venue', 'startDate', 'endDate']) // Critical for fast conflict detection!
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Venue, (venue) => venue.bookings, { onDelete: 'CASCADE' })
  venue: Venue;

  @ManyToOne(() => User, (user) => user.organizedBookings)
  organizer: User;

  @Column({ type: 'timestamptz' }) // Better for timezones
  startDate: Date;

  @Column({ type: 'timestamptz' })
  endDate: Date;

  @Column({ type: 'enum', enum: RequestStatus, default: RequestStatus.PENDING })
  status: RequestStatus;

  @Column()
  eventName: string; // Make required — helps identification

  @Column({ nullable: true })
  description: string; // Renamed from details → clearer

  @Column({ nullable: true, type: 'int' })
  expectedAttendees?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Permit, (permit) => permit.booking, { onDelete: 'CASCADE' })
  permits: Permit[];
}
