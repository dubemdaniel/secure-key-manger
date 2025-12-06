import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto): Promise<{ accessToken: string; user: User }> {
    const user = await this.usersService.createUser(dto.email, dto.password);
    const accessToken = await this.signToken(user);
    return { accessToken, user };
  }

  async login(dto: LoginDto): Promise<{ accessToken: string; user: User }> {
    const user = await this.usersService.validateUser(dto.email, dto.password);
    const accessToken = await this.signToken(user);
    return { accessToken, user };
  }

  private async signToken(user: User): Promise<string> {
    return this.jwtService.signAsync(
      { sub: user.id, email: user.email },
      {
        expiresIn: '1h',
      },
    );
  }
}
