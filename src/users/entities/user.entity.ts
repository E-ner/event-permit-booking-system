import { Booking } from 'src/bookings/entities/booking.entity';
import { Permit } from 'src/permits/entities/permit.entity';
import { Venue } from 'src/venues/entities/venue.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum UserRole {
  ORGANIZER = 'ORGANIZER',
  VENUE_MANAGER = 'VENUE_MANAGER',
  AUTHORITY = 'AUTHORITY',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // Hashed password

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Venue, (venue) => venue.manager, { cascade: true })
  managedVenues: Venue[];

  @OneToMany(() => Booking, (booking) => booking.organizer, { cascade: true })
  organizedBookings: Booking[];

  @OneToMany(() => Permit, (permit) => permit.applicant, { cascade: true })
  appliedPermits: Permit[];
}