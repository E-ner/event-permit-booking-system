import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsUUID,
  IsDateString,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
} from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({
    description: 'Venue to book',
    example: 'a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8',
  })
  @IsUUID()
  @IsNotEmpty()
  venueId: string;

  @ApiProperty({
    description: 'Event start (UTC ISO format)',
    example: '2026-02-15T09:00:00Z',
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'Event end (UTC ISO format)',
    example: '2026-02-15T18:00:00Z',
  })
  @IsDateString()
  endDate: string;

  @ApiProperty({
    description: 'Event name',
    example: 'Tech Summit',
  })
  @IsString()
  @IsNotEmpty()
  eventName: string; // <--- ADD THIS

  @ApiProperty({
    description: 'Event purpose/description',
    example: 'International Tech Summit 2026',
  })
  @IsString()
  @IsNotEmpty()
  details: string; // This usually maps to 'description' in your entity

  @ApiPropertyOptional({
    description: 'Maximum capacity',
    type: Number,
    example: 2600,
  })
  @IsOptional()
  @IsInt()
  expectedAttendees?: number;
}
