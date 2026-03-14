import { Controller } from '@nestjs/common';
import { QuoteService } from '../schema/quote.service';

@Controller('quote')
export class QuoteController {
  constructor(private readonly quoteService: QuoteService) {}
}
