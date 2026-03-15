import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const config = new DocumentBuilder()
    .setTitle('VAAD API')
    .setDescription('The VAAD API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const documentPath = 'api';
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 3000);

  Logger.debug(`http://localhost:${process.env.PORT}`);
  Logger.debug(
    `Documentation => http://localhost:${process.env.PORT}/${documentPath}`,
  );
}
bootstrap();
