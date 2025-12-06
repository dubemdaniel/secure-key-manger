import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRequest } from '../../types/auth-request';

@Injectable()
export class RequireUserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<AuthRequest>();
    if (req.authType === 'user' && req.user) {
      return true;
    }
    throw new UnauthorizedException('User access required');
  }
}
