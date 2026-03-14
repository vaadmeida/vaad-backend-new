import { Module } from '@nestjs/common';
import { DatabaseService } from './service/database.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const uri: string = configService.getOrThrow<string>('MONGODB_URI');
        return { uri, autoIndex: true };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
