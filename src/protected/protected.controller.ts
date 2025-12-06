import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { RequireUserGuard } from '../common/guards/require-user.guard';
import { RequireServiceGuard } from '../common/guards/require-service.guard';
import type { AuthRequest } from '../types/auth-request';

@Controller('protected')
@ApiTags('protected')
export class ProtectedController {
  @Get('user')
  @UseGuards(RequireUserGuard)
  @ApiBearerAuth('bearer')
  userRoute(@Req() req: AuthRequest) {
    return {
      message: 'User token accepted',
      user: req.user,
    };
  }

  @Get('service')
  @UseGuards(RequireServiceGuard)
  @ApiSecurity('apiKey')
  serviceRoute(@Req() req: AuthRequest) {
    return {
      message: 'Service API key accepted',
      apiKey: {
        id: req.apiKey?.id,
        serviceName: req.apiKey?.serviceName,
        prefix: req.apiKey?.prefix,
      },
    };
  }
}
