import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get env(): string {
    return (
      this.configService.get<string>('env', {
        infer: true,
      }) ?? ' '
    );
  }
  get port(): number {
    return this.configService.get<number>('port', {
      infer: true,
    });
  }
  get frontUrl(): string {
    return (
      this.configService.get<string>('frontUrl', {
        infer: true,
      }) ?? ' '
    );
  }

  get jwtSecret(): string {
    return (
      this.configService.get<string>('jwtSecret', {
        infer: true,
      }) ?? ' '
    );
  }
}
