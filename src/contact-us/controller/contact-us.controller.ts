import { Body, Controller, Post } from '@nestjs/common';
import { ContactUsService } from '../service/contact-us.service';
import { CreateContactUsDTO } from '../dto/contact-us.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Contact Us')
@Controller('contact-us')
export class ContactUsController {
  constructor(private readonly contactUsService: ContactUsService) {}

  @Post()
  async createContactUs(@Body() contactUs: CreateContactUsDTO) {
    return this.contactUsService.createContactUs(contactUs);
  }
}
