import { Module } from '@nestjs/common';
import { NewsletterService } from './service/newsletter.service';
import { NewsletterController } from './controller/newsletter.controller';

@Module({
  controllers: [NewsletterController],
  providers: [NewsletterService],
})
export class NewsletterModule {}
