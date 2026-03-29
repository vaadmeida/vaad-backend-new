import { Injectable } from '@nestjs/common';
import { SesService } from './ses.service';

@Injectable()
export class NotificationService {
  constructor(private readonly sesService: SesService) {}

  async sendEmail({
    email,
    subject,
    template,
  }: {
    email: string;
    subject: string;
    template: string;
  }) {
    try {
      await this.sesService.sendEmail({ email, subject, template });
    } catch (error) {
      new Error(`Failed to send email to ${email}: ${error.message}`);
    }
  }
}
