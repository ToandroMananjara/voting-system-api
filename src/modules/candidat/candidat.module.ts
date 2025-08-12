import { Module } from '@nestjs/common';
import { CandidatService } from './candidat.service';
import { CandidatController } from './candidat.controller';

@Module({
  controllers: [CandidatController],
  providers: [CandidatService],
})
export class CandidatModule {}
