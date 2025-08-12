import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateVoteDto {
  @IsNumber()
  @IsNotEmpty()
  candidatId: number;
}
