import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { KeysService } from './keys.service';
import { CreateKeyDto } from './dto/create-key.dto';
import { RevokeKeyDto } from './dto/revoke-key.dto';
import { RequireUserGuard } from '../common/guards/require-user.guard';
import type { AuthRequest } from '../types/auth-request';

@Controller('keys')
@UseGuards(RequireUserGuard)
@ApiTags('keys')
@ApiBearerAuth('bearer')
export class KeysController {
  constructor(private readonly keysService: KeysService) {}

  @Post('create')
  createKey(@Req() req: AuthRequest, @Body() dto: CreateKeyDto) {
    const { rawKey, record } = this.keysService.createKey(req.user!.sub, dto);
    return {
      apiKey: rawKey,
      keyId: record.id,
      prefix: record.prefix,
      serviceName: record.serviceName,
      expiresAt: record.expiresAt,
    };
  }

  @Post('revoke')
  revokeKey(@Req() req: AuthRequest, @Body() dto: RevokeKeyDto) {
    this.keysService.revokeKey(dto.keyId, req.user!.sub);
    return { revoked: true };
  }

  @Get()
  list(@Req() req: AuthRequest) {
    return this.keysService.listKeysForUser(req.user!.sub).map((k) => ({
      keyId: k.id,
      prefix: k.prefix,
      serviceName: k.serviceName,
      createdAt: k.createdAt,
      expiresAt: k.expiresAt,
      revoked: k.revoked,
    }));
  }
}

