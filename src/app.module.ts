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
import { UtilModule } from './../libs/util/src/util.module';
import { EnvTypeEnum } from '../libs/util/src/env/env.enum';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RequestModule } from './request/request.module';
import { RequestLoggerMiddleware } from '@app/util/middleware/requestLogger.middleware';
import { TokenMiddleware } from '@app/util/auth/middleware/token.middleware';
import { NewsletterModule } from './newsletter/newsletter.module';
import { OptionalTokenMiddleware } from '@app/util/auth/middleware/optional-token.middleware';
import { ContactUsModule } from './contact-us/contact-us.module';
import { MediaPartnerModule } from './media-partner/media-partner.module';
import { BlogModule } from './blog/blog.module';
import { FileModule } from './file/file.module';
import { NotificationModule } from './notification/notification.module';
import { OrderModule } from './order/order.module';

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
    UsersModule,
    AuthModule,
    RequestModule,
    NewsletterModule,
    ContactUsModule,
    MediaPartnerModule,
    BlogModule,
    FileModule,
    NotificationModule,
    OrderModule,
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
        { path: '/auth/users/refresh-tokens', method: RequestMethod.POST },
        //
        { path: '/auth/media-partners/sign-up', method: RequestMethod.POST },
        {
          path: '/auth/media-partners/generate-tokens',
          method: RequestMethod.POST,
        },
        { path: '/auth/media-partners/login', method: RequestMethod.POST },
        {
          path: '/auth/media-partners/forget-password',
          method: RequestMethod.POST,
        },
        {
          path: '/auth/media-partners/refresh-tokens',
          method: RequestMethod.POST,
        },
        //
        { path: '/auth/admins/generate-tokens', method: RequestMethod.POST },
        { path: '/auth/admins/login', method: RequestMethod.POST },
        { path: '/auth/admins/forget-password', method: RequestMethod.POST },
        { path: '/auth/admins/refresh-tokens', method: RequestMethod.POST },
        //
        { path: '/requests/media-plans', method: RequestMethod.POST },
        { path: '/billboards/assets', method: RequestMethod.GET },
        { path: '/billboards/search', method: RequestMethod.GET },
        { path: '/billboards/explore', method: RequestMethod.GET },
        { path: '/newsletters/join', method: RequestMethod.POST },
        { path: '/newsletters/leave', method: RequestMethod.POST },
        { path: '/contact-us', method: RequestMethod.POST },
        { path: '/requests/media-plans', method: RequestMethod.POST },
        { path: '/requests/consultations', method: RequestMethod.POST },
        { path: '/blogs', method: RequestMethod.GET },
        { path: '/blogs/assets', method: RequestMethod.GET },
        { path: '/blogs/:id', method: RequestMethod.GET },
        { path: '/blogs/:id/comments', method: RequestMethod.GET },
        { path: '/blogs/comments', method: RequestMethod.POST },
      )
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      });

    // optional token middleware for routes that can be accessed with or without authentication;
    consumer
      .apply(OptionalTokenMiddleware)
      .forRoutes({ path: '/billboards/search', method: RequestMethod.GET });
  }
}
