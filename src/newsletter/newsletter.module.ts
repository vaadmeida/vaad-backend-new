import { Module } from '@nestjs/common';
import { NewsletterService } from './service/newsletter.service';
import { NewsletterController } from './controller/newsletter.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Newsletter, NewsletterSchema } from './schema/newsletter.schema';

@Module({
  controllers: [NewsletterController],
  providers: [NewsletterService],
  imports: [
    MongooseModule.forFeature([
      { name: Newsletter.name, schema: NewsletterSchema },
    ]),
  ],
})
export class NewsletterModule {}
