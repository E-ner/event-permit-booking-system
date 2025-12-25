import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { RequestStatus } from 'src/common/enums/request-status.enum';

export class UpdatePermitStatusDto {

  @ApiProperty({
    enum: RequestStatus,
    example: RequestStatus.APPROVED,
  })
  @IsEnum(RequestStatus)
  status: RequestStatus;

  @ApiPropertyOptional({
    description: 'Official notes from authority',
    example: 'Approved with condition: submit noise report post-event',
  })
  @IsOptional()
  @IsString()
  authorityNotes: string;
}