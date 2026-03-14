import { Module } from '@nestjs/common';
import { QuoteService } from './schema/quote.service';
import { QuoteController } from './controller/quote.controller';

@Module({
  controllers: [QuoteController],
  providers: [QuoteService],
})
export class QuoteModule {}
