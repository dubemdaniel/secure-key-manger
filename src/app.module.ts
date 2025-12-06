import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { KeysModule } from './keys/keys.module';
import { AuthDetectionMiddleware } from './common/middleware/auth-detection.middleware';
import { ProtectedController } from './protected/protected.controller';

@Module({
  imports: [AuthModule, UsersModule, KeysModule],
  controllers: [AppController, ProtectedController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthDetectionMiddleware).forRoutes('*');
  }
}
