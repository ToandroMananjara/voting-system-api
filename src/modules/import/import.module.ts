// src/modules/import/import.module.ts
import { ImportService } from '@/modules/import/import.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [ImportService],
  exports: [ImportService],
})
export class ImportModule {}
