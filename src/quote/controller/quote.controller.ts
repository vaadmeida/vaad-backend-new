import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { QuoteService } from '../schema/quote.service';

@ApiTags('Quote')
@Controller('quote')
export class QuoteController {
  constructor(private readonly quoteService: QuoteService) {}
}
