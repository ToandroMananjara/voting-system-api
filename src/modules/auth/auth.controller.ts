import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '@/modules/user/dto/create-user.dto';
import { SessionResponse } from './types/session-response.type';
import { Throttle } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() dto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SessionResponse> {
    const session = await this.authService.signup(dto);
    this.setRefreshTokenCookie(res, session.token.refresh_token);
    return session;
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SessionResponse> {
    const session = await this.authService.signin(dto.email, dto.password);

    this.setRefreshTokenCookie(res, session.token.refresh_token);
    return session;
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ auth_token: string }> {
    const refreshToken = req.cookies?.['refresh_token'];
    if (!refreshToken)
      throw new UnauthorizedException('Refresh token manquant');

    const tokens = await this.authService.refreshToken(refreshToken);
    this.setRefreshTokenCookie(res, tokens.refresh_token);

    return { auth_token: tokens.auth_token };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout(
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    res.clearCookie('refresh_token', { path: '/auth/refresh' });
    return { message: 'Déconnexion effectuée côté client (cookie supprimé)' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getProfile(@Req() req: Request) {
    return {
      uuid: req.user['id'],
      email: req.user['email'],
      displayName: req.user['full_name'],
    };
  }

  private setRefreshTokenCookie(res: Response, token: string): void {
    res.cookie('refresh_token', token, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
}
