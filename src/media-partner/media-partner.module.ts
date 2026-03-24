import { Module } from '@nestjs/common';
import { MediaPartnerService } from './service/media-partner.service';
import { MediaPartnerController } from './controller/media-partner.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MediaPartner,
  MediaPartnerSchema,
} from './schema/media-partner.schema';

@Module({
  exports: [MediaPartnerService],
  controllers: [MediaPartnerController],
  providers: [MediaPartnerService],
  imports: [
    MongooseModule.forFeature([
      { name: MediaPartner.name, schema: MediaPartnerSchema },
    ]),
  ],
})
export class MediaPartnerModule {}
