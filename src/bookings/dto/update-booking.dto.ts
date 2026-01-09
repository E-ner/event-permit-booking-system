// src/bookings/dto/update-booking-status.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { RequestStatus } from 'src/common/enums/request-status.enum';

export class UpdateBookingStatusDto {
  @ApiProperty({
    enum: RequestStatus,
    description: 'New status',
    example: RequestStatus.APPROVED,
  })
  @IsEnum(RequestStatus)
  status: RequestStatus;
}
