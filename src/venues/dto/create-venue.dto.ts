import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateVenueDto {


  @ApiProperty({
    description: 'Name of the venue',
    example: 'Kigali Convention Centre',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Full address',
    example: 'KG 7 Ave, Kigali, Rwanda',
  })
  @IsString()
  address: string;


  @ApiProperty({
    description: 'Latitude coordinate',
    type: Number,
    minimum: -90,
    maximum: 90,
    example: -1.9546,
  })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;


  @ApiProperty({
    description: 'Longitude coordinate',
    type: Number,
    minimum: -180,
    maximum: 180,
    example: 30.0930,
  })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;


  @ApiPropertyOptional({
    description: 'Description of facilities',
    example: 'Iconic dome-shaped centre with 2600 capacity',
  })
  @IsOptional()
  @IsString()
  description?: string;


  @ApiPropertyOptional({
    description: 'Maximum capacity',
    type: Number,
    example: 2600,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  capacity?: number;
}