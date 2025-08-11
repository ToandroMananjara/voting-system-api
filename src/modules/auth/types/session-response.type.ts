import { User } from '@prisma/client';
export interface Token {
  auth_token: string;
  refresh_token: string;
}
type safeUser = Omit<User, 'password'>;
export interface SessionResponse {
  token: Token;
  user: safeUser;
}
