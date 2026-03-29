import { Injectable } from '@nestjs/common';
import { SesService } from './ses.service';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class NotificationService {
  constructor(
    private readonly sesService: SesService,
    @InjectQueue('EMAIL_QUEUE') private emailQueue: Queue,
  ) {}

  async sendEmail({
    email,
    subject,
    template,
  }: {
    email: string;
    subject: string;
    template: string;
  }) {
    if (process.env.NODE_ENV === 'production') {
      await this.emailQueue.add('send-welcome', { email, subject, template });
    } else {
      await this.sesService.sendEmail({ email, subject, template });
    }
  }
}
