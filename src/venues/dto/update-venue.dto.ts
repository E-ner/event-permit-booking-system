// src/venues/dto/update-venue.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateVenueDto } from './create-venue.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';

export class UpdateVenueDto extends PartialType(CreateVenueDto) {
  @ApiPropertyOptional({
    description: 'Updated name of the venue',
    example: 'Kigali Convention Centre - Main Hall',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Updated full address',
    example: 'KG 7 Ave, Kigali, Rwanda (New Wing)',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'Updated latitude coordinate',
    type: Number,
    minimum: -90,
    maximum: 90,
    example: -1.9548,
  })
  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @ApiPropertyOptional({
    description: 'Updated longitude coordinate',
    type: Number,
    minimum: -180,
    maximum: 180,
    example: 30.0932,
  })
  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;

  @ApiPropertyOptional({
    description: 'Updated description of facilities',
    example: 'Renovated in 2025 with new lighting and sound system',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Updated maximum capacity',
    type: Number,
    example: 2800,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  capacity?: number;
}