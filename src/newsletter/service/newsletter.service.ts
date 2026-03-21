import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Newsletter } from '../schema/newsletter.schema';

@Injectable()
export class NewsletterService {
  constructor(
    @InjectModel(Newsletter.name) readonly NewsletterModel: Model<Newsletter>,
  ) {}

  joinNewsletter(email: string) {
    return this.NewsletterModel.findOneAndUpdate(
      { email: email.trim().toLowerCase() },
      { $set: { email: email.trim().toLowerCase() } },
      { upsert: true, returnDocument: 'after' },
    );
  }

  leaveNewsletter(email: string) {
    return this.NewsletterModel.findOneAndDelete({
      email: email.trim().toLowerCase(),
    });
  }
}
