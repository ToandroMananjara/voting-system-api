import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCandidatDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  numero_inscription: string;

  @IsOptional()
  @IsString()
  photo_profile?: string;
}
