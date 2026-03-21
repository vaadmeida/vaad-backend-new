import { Module } from '@nestjs/common';
import { ContactUsService } from './service/contact-us.service';
import { ContactUsController } from './controller/contact-us.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactUs, ContactUsSchema } from './schema/contact-us.schema';

@Module({
  controllers: [ContactUsController],
  providers: [ContactUsService],
  imports: [
    MongooseModule.forFeature([
      { name: ContactUs.name, schema: ContactUsSchema },
    ]),
  ],
})
export class ContactUsModule {}
