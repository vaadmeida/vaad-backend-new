import { Controller } from '@nestjs/common';
import { NewsletterService } from '../service/newsletter.service';

@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}
}
