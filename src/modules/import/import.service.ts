import * as XLSX from 'xlsx';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/modules/prisma/prisma.service';

@Injectable()
export class ImportService {
  constructor(private readonly prisma: PrismaService) {}

  async importNumeroInscriptionFromExcel(path: string) {
    const workbook = XLSX.readFile(path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json<{ numero_inscription?: string }>(
      worksheet,
    );
    const numeros = data.map((row) => row.numero_inscription).filter(Boolean);

    const batchSize = 500;
    for (let i = 0; i < numeros.length; i += batchSize) {
      const batch = numeros.slice(i, i + batchSize);
      await this.prisma.user.createMany({
        data: batch.map((num) => ({
          numero_inscription: num,
          // autre champs par défaut
        })),
        skipDuplicates: true,
      });
    }
  }
}
