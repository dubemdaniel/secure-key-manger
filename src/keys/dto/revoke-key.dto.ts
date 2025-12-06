import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RevokeKeyDto {
  @ApiProperty({ example: 'key-id-uuid' })
  @IsString()
  keyId!: string;
}
