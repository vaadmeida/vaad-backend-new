import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { ResponseLoggerInterceptor } from '@app/util/interceptor/response-logger.interceptor';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set('trust proxy', 'loopback');
  app.use(helmet());
  app.enableShutdownHooks();
  app.enableCors({ credentials: true });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new ResponseLoggerInterceptor());

  const config = new DocumentBuilder()
    .setTitle('VAAD API')
    .setDescription('The VAAD API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const documentPath = 'api';
  SwaggerModule.setup(documentPath, app, document);

  const configService = app.get(ConfigService);

  const PORT = configService.getOrThrow('PORT');
  await app.listen(PORT);

  Logger.debug(`http://localhost:${PORT}`);
  Logger.debug(`Documentation => http://localhost:${PORT}/${documentPath}`);
}
bootstrap();
