import { ConfigService } from '@nestjs/config';
import {
  SESClient,
  SendEmailCommand,
  SendEmailCommandInput,
} from '@aws-sdk/client-ses';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class SesService {
  private readonly logger = new Logger(SesService.name);
  private readonly emailSender: string;

  private readonly sesClient: SESClient;

  constructor(
    private readonly configService: ConfigService,
    @InjectQueue('EMAIL_QUEUE') private mailQueue: Queue,
  ) {
    this.emailSender = this.configService.getOrThrow('EMAIL_SENDER');

    this.sesClient = new SESClient({
      region: this.configService.getOrThrow('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.getOrThrow('EMAIL_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow(
          'EMAIL_SECRET_ACCESS_KEY',
        ),
      },
    });
  }

  private sendCommand({ email, subject, text, template }) {
    const Body = template
      ? {
          Html: {
            Charset: 'UTF-8',
            Data: template,
          },
        }
      : {
          Text: {
            Charset: 'UTF-8',
            Data: text,
          },
        };
    const input: SendEmailCommandInput = {
      Destination: { ToAddresses: [email] },
      Message: {
        Body,
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
      Source: this.configService.getOrThrow('EMAIL_SENDER'),
      ReplyToAddresses: [this.configService.getOrThrow('EMAIL_SENDER')],
    };

    return new SendEmailCommand(input);
  }

  private async sendSesEmail({ email, subject, text, template }) {
    try {
      const response = await this.sesClient.send(
        this.sendCommand({ email, subject, text, template }),
      );
      this.logger.debug(`Email sent to ${email} successfully`);
      return response;
    } catch (error) {
      this.logger.error(`Failed to send email to ${email}, error: ${error}  `);
      throw new InternalServerErrorException('Failed to send email');
    }
  }

  async sendEmail({ email, subject, template }) {
    await this.sendSesEmail({ email, subject, template, text: '' });
  }
}
