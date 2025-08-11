import { DocumentBuilder } from '@nestjs/swagger';
export const swaggerOptions = new DocumentBuilder()
  .setTitle('Food-Truck')
  .setDescription('Documentation')
  .setVersion('1.0')
  .addServer('', 'Local environment')
  .addServer('', 'Staging')
  .addServer('', 'Production')
  .addTag('')
  .build();
