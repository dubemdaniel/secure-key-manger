import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateKeyDto {
  @ApiProperty({ required: false, example: 'payments-service' })
  @IsOptional()
  @IsString()
  serviceName?: string;

  @ApiProperty({ required: false, example: 24, minimum: 1, maximum: 8760 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(24 * 365)
  expiresInHours?: number;
}
