import { Logger, Injectable } from '@nestjs/common';
import { SesService } from './ses.service';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

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
      this.logger.error(
        error instanceof Error ? error.message : String(error),
        error instanceof Error ? error.stack : undefined,
      );
      new Error(`Failed to send email to ${email}: ${error.message}`);
    }
  }
}
