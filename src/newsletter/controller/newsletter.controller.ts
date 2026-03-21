import { Body, Controller, Post } from '@nestjs/common';
import { NewsletterService } from '../service/newsletter.service';
import { JoinNewsletterDTO } from '../dto/newsletter.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Newsletters')
@Controller('newsletters')
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @Post('join')
  joinNewsletter(@Body() { email }: JoinNewsletterDTO) {
    return this.newsletterService.joinNewsletter(email);
  }

  @Post('leave')
  leaveNewsletter(@Body() { email }: JoinNewsletterDTO) {
    return this.newsletterService.leaveNewsletter(email);
  }
}
