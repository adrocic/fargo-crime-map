import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const config = new DocumentBuilder()
    .setTitle('Fargo Crime Map API')
    .setDescription(
      'These are Fargo Crime Map. Here you will find detailed endpoints and schemas for each point of data that can be visualized from the Fargo Crime Map site.',
    )
    .setVersion('1.0')
    .addTag('Dispatch Log Info')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
