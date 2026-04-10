import { Module } from '@nestjs/common';
import { MediaPartnerService } from './service/media-partner.service';
import { MediaPartnerController } from './controller/media-partner.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MediaPartner,
  MediaPartnerSchema,
} from './schema/media-partner.schema';
import { BillboardModule } from 'src/billboard/billboard.module';

@Module({
  exports: [MediaPartnerService],
  controllers: [MediaPartnerController],
  providers: [MediaPartnerService],
  imports: [
    BillboardModule,
    MongooseModule.forFeature([
      { name: MediaPartner.name, schema: MediaPartnerSchema },
    ]),
  ],
})
export class MediaPartnerModule {}
