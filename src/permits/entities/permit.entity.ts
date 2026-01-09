import { Booking } from 'src/bookings/entities/booking.entity';
import { PermitType } from 'src/common/enums/permit-type.enum';
import { RequestStatus } from 'src/common/enums/request-status.enum';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('permits')
export class Permit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Booking, (booking) => booking.permits)
  booking: Booking;

  @ManyToOne(() => User, (user) => user.appliedPermits)
  applicant: User;

  @Column({ type: 'enum', enum: RequestStatus, default: RequestStatus.PENDING })
  status: RequestStatus;

  @Column({ type: 'enum', enum: PermitType, nullable: true })
  type: PermitType;

  @Column({ nullable: false })
  details: string;

  @Column({ nullable: true })
  authorityNotes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
