// import { Processor, WorkerHost } from '@nestjs/bullmq';
// import { Logger } from '@nestjs/common';
// import { Job } from 'bullmq';
// import { SesService } from '../service/ses.service';

// @Processor('EMAIL_QUEUE')
// export class EmailProcessor extends WorkerHost {
//   private readonly logger = new Logger(EmailProcessor.name);

//   constructor(private readonly emailService: SesService) {
//     super();
//   }

//   async process(job: Job<any, any, string>): Promise<any> {
//     switch (job.name) {
//       case 'send-welcome':
//         this.logger.debug(`Sending email to ${job.data.email}...`);
//         await this.emailService.sendEmail(job.data);
//         return { sent: true };
//     }
//   }
// }
