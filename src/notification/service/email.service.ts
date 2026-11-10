import { SesService } from './ses.service';
import { Logger, Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly sesService: SesService) {}
}
