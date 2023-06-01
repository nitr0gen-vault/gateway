import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
//import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'typeorm';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.enableCors();

  // const config = new DocumentBuilder()
  //   .setTitle('Nitr0gen App Server')
  //   .setVersion('1.0')
  //   //.addTag('security')
  //   .addApiKey({
  //     type: 'apiKey',
  //     name: 'X-API-KEY',
  //     in: 'header',
  //   }, 'X-API-KEY')
  //   .build();
  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('api', app, document);

  const PORT = Number(process.env.PORT) || 8080;
  await app.listen(PORT);

  
}
bootstrap();
