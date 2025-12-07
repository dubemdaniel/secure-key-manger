import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../types/auth-request';
import { KeysService } from '../../keys/keys.service';
import { UsersService } from '../../users/users.service';

@Injectable()
export class AuthDetectionMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly keysService: KeysService,
    private readonly usersService: UsersService,
  ) {}

  async use(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const apiKeyHeader = req.headers['x-api-key'];

    const bearerToken = this.extractBearer(authHeader);
    if (bearerToken) {
      try {
        const payload = await this.jwtService.verifyAsync<{
          sub: string;
          email: string;
        }>(bearerToken, { secret: process.env.JWT_SECRET || 'dev_jwt_secret' });
        const user = await this.usersService.getById(payload.sub);
        if (user) {
          req.authType = 'user';
          req.user = { sub: user.id, email: user.email };
          return next();
        }
      } catch {
        
      }
    }

    const incomingApiKey = this.extractApiKey(authHeader, apiKeyHeader);
    if (incomingApiKey) {
      const record = this.keysService.validateApiKey(incomingApiKey);
      if (record) {
        req.authType = 'service';
        req.apiKey = record;
        return next();
      }
    }

    return next();
  }

  private extractBearer(authHeader?: string | string[]): string | null {
    if (!authHeader) return null;
    const headerValue = Array.isArray(authHeader) ? authHeader[0] : authHeader;
    if (!headerValue.toLowerCase().startsWith('bearer ')) return null;
    return headerValue.slice(7).trim();
  }

  private extractApiKey(
    authHeader?: string | string[],
    apiKeyHeader?: string | string[],
  ): string | null {
    if (apiKeyHeader) {
      return Array.isArray(apiKeyHeader) ? apiKeyHeader[0] : apiKeyHeader;
    }
    if (!authHeader) return null;
    const headerValue = Array.isArray(authHeader) ? authHeader[0] : authHeader;
    if (headerValue.toLowerCase().startsWith('apikey ')) {
      return headerValue.slice(7).trim();
    }
    return null;
  }
}
