import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AdminModule } from './admin/admin.module';
import { BillboardModule } from './billboard/billboard.module';
import { QuoteModule } from './quote/quote.module';
import { UtilModule } from './../libs/util/src/util.module';
import { EnvTypeEnum } from '../libs/util/src/env/env.enum';

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
  ],
  controllers: [AppController],
})
export class AppModule {}
