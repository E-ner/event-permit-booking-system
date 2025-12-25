// src/permits/permits.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermitsService } from './permits.service';
import { PermitsController } from './permits.controller';
import { Permit } from './entities/permit.entity';
import { Booking } from '../bookings/entities/booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Permit, Booking])],
  controllers: [PermitsController],
  providers: [PermitsService],
})
export class PermitsModule {}