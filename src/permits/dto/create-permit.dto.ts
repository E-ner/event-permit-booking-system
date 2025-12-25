import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsEnum, IsString, IsNotEmpty } from 'class-validator';
import { PermitType } from 'src/common/enums/permit-type.enum';

export class CreatePermitDto {

  @ApiProperty({
    description: 'Approved booking this permit is for',
    example: 'b2c3d4e5-f6g7-8901-h2i3-j4k5l6m7n8o9',
  })
  @IsUUID()
  bookingId: string;

  @ApiProperty({
    enum: PermitType,
    description: 'Permit category',
    example: PermitType.NOISE_CONTROL,
  })
  @IsEnum(PermitType)
  type: PermitType;


  @ApiProperty({
    description: 'Compliance evidence and mitigation measures',
    example: 'Sound capped at 85 dB. Professional engineer on site. Event ends 22:00.',
  })
  @IsString()
  @IsNotEmpty()
  details?: string;
}