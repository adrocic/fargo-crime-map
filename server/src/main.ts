import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { setupMapTileDirectories } from './utils/directory';

// Load environment variables from .env file
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bodyParser: true,
  });

  // Set up static directory structure
  setupMapTileDirectories();

  const config = new DocumentBuilder()
    .setTitle('Fargo Crime Map API')
    .setDescription(
      'This is Fargo Crime Map. Here you will find detailed endpoints and schemas for each point of data that can be visualized from the Fargo Crime Map site.',
    )
    .setVersion('1.0')
    .addTag('Dispatch Log Info')
    .addTag('Map Tiles')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
