import { UserRole } from '@prisma/client';
export interface AuthPayload {
  sub: string;
  numeroInscription: string;
  role: UserRole;
  professionalType?: string | null;
}
