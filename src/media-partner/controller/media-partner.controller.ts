import { Controller } from '@nestjs/common';
import { MediaPartnerService } from '../service/media-partner.service';

@Controller('media-partner')
export class MediaPartnerController {
  constructor(private readonly mediaPartnerService: MediaPartnerService) {}
}
