import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '@/common/modules/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '@/common/strategy/jwt.strategy';
import { AppConfigService } from '@/common/modules/config/config.service';
import { UserModule } from '@/modules/user/user.module';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        secret: config.jwtSecret,
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtStrategy, AppConfigService],
  exports: [AuthService],
})
export class AuthModule {}
