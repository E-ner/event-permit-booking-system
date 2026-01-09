import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchVenuesDto {
  @ApiPropertyOptional({
    description: 'Search keyword in venue name or address',
    example: 'Kigali Convention',
  })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({
    description: 'Latitude for proximity search',
    type: Number,
    example: -1.9441,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat?: number;

  @ApiPropertyOptional({
    description: 'Longitude for proximity search',
    type: Number,
    example: 30.0619,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  long?: number;

  @ApiPropertyOptional({
    description: 'Search radius in kilometers',
    type: Number,
    example: 20,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  radiusKm?: number = 10; // default 10km
}
