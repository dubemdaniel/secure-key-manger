import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'dubem@gmail.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ minLength: 6, example: 'dubemdaniel' })
  @IsString()
  @MinLength(6)
  password!: string;
}
