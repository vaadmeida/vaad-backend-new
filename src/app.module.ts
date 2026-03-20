import { ConfigModule } from '@nestjs/config';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AdminModule } from './admin/admin.module';
import { BillboardModule } from './billboard/billboard.module';
import { QuoteModule } from './quote/quote.module';
import { UtilModule } from './../libs/util/src/util.module';
import { EnvTypeEnum } from '../libs/util/src/env/env.enum';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RequestModule } from './request/request.module';
import { RequestLoggerMiddleware } from '@app/util/middleware/requestLogger.middleware';
import { TokenMiddleware } from '@app/util/auth/middleware/token.middleware';
import { NewsletterModule } from './newsletter/newsletter.module';

const envFilePath =
  EnvTypeEnum.Production === process.env['NODE_ENV']
    ? '.env.local'
    : '.env.local';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath }),
    UtilModule,
    AdminModule,
    BillboardModule,
    QuoteModule,
    UsersModule,
    AuthModule,
    RequestModule,
    NewsletterModule,
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // RequestLoggerMiddleware;
    consumer
      .apply(RequestLoggerMiddleware)
      .exclude({ path: '', method: RequestMethod.GET })
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      });

    // TokenMiddleware;
    consumer
      .apply(TokenMiddleware)
      .exclude(
        { path: '', method: RequestMethod.GET },
        { path: '/auth/users/sign-up', method: RequestMethod.POST },
        { path: '/auth/users/generate-tokens', method: RequestMethod.POST },
        { path: '/auth/users/login', method: RequestMethod.POST },
        { path: '/auth/users/forget-password', method: RequestMethod.POST },
        { path: '/requests/media-plans', method: RequestMethod.POST },
        { path: '/billboards/assets', method: RequestMethod.GET },
        { path: '/billboards/search', method: RequestMethod.GET },
      )
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      });
  }
}
