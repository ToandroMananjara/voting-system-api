import { AppModule } from '../app.module';
import { ImportService } from '../modules/import/import.service';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const importService = appContext.get(ImportService);

  // Chemin vers ton fichier Excel déjà sur le serveur
  const filePath = 'src/scripts/data.xlsx';

  await importService.importNumeroInscriptionFromExcel(filePath);
  console.log('Import terminé');

  await appContext.close();
}

bootstrap();
