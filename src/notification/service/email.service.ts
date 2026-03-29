import { SesService } from './ses.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly sesService: SesService) {}
}
