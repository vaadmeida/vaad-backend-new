import { Injectable } from '@nestjs/common';
import { ContactUs } from '../schema/contact-us.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ContactUsService {
  @InjectModel(ContactUs.name)
  private readonly ContactUsModel: Model<ContactUs>;

  async createContactUs(contactUs: Partial<ContactUs>) {
    const newContactUs = new this.ContactUsModel(contactUs);
    return await newContactUs.save();
  }
}
