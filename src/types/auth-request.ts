import { Request } from 'express';
import { ApiKeyRecord } from '../keys/key.entity';

export type AuthRequest = Request & {
  authType?: 'user' | 'service';
  user?: { sub: string; email: string };
  apiKey?: ApiKeyRecord;
};
