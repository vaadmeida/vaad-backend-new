import { Controller, Get } from '@nestjs/common';
import { MediaPartnerService } from '../service/media-partner.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Media Partner')
@Controller('media-partners')
export class MediaPartnerController {
  constructor(private readonly mediaPartnerService: MediaPartnerService) {}

  @Get('ids')
  async getIds() {
    return { ids: await this.mediaPartnerService.getPartnerIds() };
  }
}
