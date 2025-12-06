import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes, randomUUID, createHash, timingSafeEqual } from 'crypto';
import { ApiKeyRecord } from './key.entity';
import { CreateKeyDto } from './dto/create-key.dto';

@Injectable()
export class KeysService {
  private keys: ApiKeyRecord[] = [];

  createKey(
    userId: string,
    dto: CreateKeyDto,
  ): { rawKey: string; record: ApiKeyRecord } {
    const rawKey = `sk_${randomBytes(24).toString('hex')}`;
    const hashedKey = this.hash(rawKey);
    const now = new Date();
    const expiresAt = dto.expiresInHours
      ? new Date(now.getTime() + dto.expiresInHours * 60 * 60 * 1000)
      : undefined;

    const record: ApiKeyRecord = {
      id: randomUUID(),
      prefix: rawKey.slice(0, 8),
      hashedKey,
      serviceName: dto.serviceName,
      createdBy: userId,
      createdAt: now,
      expiresAt,
      revoked: false,
    };

    this.keys.push(record);
    return { rawKey, record };
  }

  revokeKey(keyId: string, userId: string): void {
    const record = this.keys.find((k) => k.id === keyId);
    if (!record) {
      throw new NotFoundException('API key not found');
    }
    if (record.createdBy !== userId) {
      throw new ForbiddenException('You cannot revoke this key');
    }
    record.revoked = true;
  }

  listKeysForUser(userId: string): ApiKeyRecord[] {
    return this.keys.filter((k) => k.createdBy === userId);
  }

  validateApiKey(rawKey: string): ApiKeyRecord | null {
    const hashedIncoming = this.hash(rawKey);
    const hashedBuffer = Buffer.from(hashedIncoming, 'hex');

    for (const record of this.keys) {
      const recordBuffer = Buffer.from(record.hashedKey, 'hex');
      if (
        hashedBuffer.length === recordBuffer.length &&
        timingSafeEqual(hashedBuffer, recordBuffer)
      ) {
        if (record.revoked) return null;
        if (record.expiresAt && record.expiresAt.getTime() < Date.now()) {
          return null;
        }
        return record;
      }
    }
    return null;
  }

  private hash(value: string): string {
    return createHash('sha256').update(value).digest('hex');
  }
}
