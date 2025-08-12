import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AppConfigService } from '@/common/modules/config/config.service';
import { AppConfigModule } from '@/common/modules/config/config.module';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ImportModule } from './import/import.module';
import { CandidatModule } from './candidat/candidat.module';
import { VoteModule } from './vote/vote.module';

@Global()
@Module({
  imports: [
    AppConfigModule,
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => ({
        secret: configService.jwtSecret,
        signOptions: { expiresIn: '24h' },
        global: true,
      }),
    }),
    ImportModule,

    AuthModule,
    UserModule,
    CandidatModule,
    VoteModule,
  ],
  providers: [],
  exports: [JwtModule],
})
export class CoreModule {}
