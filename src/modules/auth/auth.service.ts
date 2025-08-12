import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@/modules/user/user.service';
import { CreateUserDto } from '@/modules/user/dto/create-user.dto';
import { SessionResponse, Token } from './types/session-response.type';
import { AuthPayload } from './types/auth-payload.type';
import { AppConfigService } from '@/common/modules/config/config.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly config: AppConfigService,
  ) {}

  private generateSession(user: CreateUserDto & { id: string }): Token {
    const { numeroInscription, role } = user;

    const payload: AuthPayload = {
      sub: user.id,
      numeroInscription: numeroInscription,
      role: role,
    };

    return {
      auth_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload),
    };
  }

  async signup(createUserDto: CreateUserDto): Promise<SessionResponse> {
    const user = await this.usersService.create(createUserDto);
    const safeUser = {
      ...user,
      password: undefined,
    };
    return {
      token: this.generateSession({
        ...user,
      }),
      user: safeUser,
    };
  }

  async signin(numeroInscription: string): Promise<SessionResponse> {
    const user =
      await this.usersService.getByNumeroInscription(numeroInscription);
    if (!user) {
      throw new UnauthorizedException("Le numéro d'inscription n'existe pas");
    }

    const safeUser = {
      ...user,
      password: undefined,
    };
    return {
      token: this.generateSession({
        ...user,
      }),
      user: safeUser,
    };
  }

  async refreshToken(
    oldRefreshToken: string,
  ): Promise<{ auth_token: string; refresh_token: string }> {
    const payload: AuthPayload = this.jwtService.verify(oldRefreshToken, {
      secret: this.config.jwtSecret,
    });

    const newPayload: AuthPayload = {
      sub: payload.sub,
      numeroInscription: payload.numeroInscription,
      role: payload.role,
    };

    const newAuthToken = this.jwtService.sign(newPayload, {
      secret: this.config.jwtSecret,
    });
    const newRefreshToken = this.jwtService.sign(newPayload, {
      secret: this.config.jwtSecret,
    });

    return {
      auth_token: newAuthToken,
      refresh_token: newRefreshToken,
    };
  }
}
