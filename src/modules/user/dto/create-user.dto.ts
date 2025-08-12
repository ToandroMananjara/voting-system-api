import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, MinLength } from 'class-validator';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({
    example: '123456',
    description: 'User unique identifier',
  })
  @IsOptional()
  numeroInscription?: string;

  @ApiProperty({
    example: 'STUDENT',
    description: 'User role',
    enum: UserRole,
    enumName: 'UserRole',
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiProperty({
    example: 'SecurePassword123!',
    description: 'User password',
    minLength: 8,
    format: 'password',
  })
  @IsOptional()
  @MinLength(8)
  password?: string;
}
