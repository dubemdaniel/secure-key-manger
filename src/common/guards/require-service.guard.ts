import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRequest } from '../../types/auth-request';

@Injectable()
export class RequireServiceGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<AuthRequest>();
    if (req.authType === 'service' && req.apiKey) {
      return true;
    }
    throw new UnauthorizedException('Service API key required');
  }
}
