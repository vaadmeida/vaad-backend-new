import { Controller, Get } from '@nestjs/common';
import { MediaPartnerService } from '../service/media-partner.service';
import { ApiTags } from '@nestjs/swagger';
import { BillboardService } from 'src/billboard/service/billboard.service';

@ApiTags('Media Partner')
@Controller('media-partners')
export class MediaPartnerController {
  constructor(
    private readonly mediaPartnerService: MediaPartnerService,
    private readonly billboardService: BillboardService,
  ) {}

  @Get('ids')
  async getIds() {
    return {
      ids: Array.from(
        new Set([
          ...(await this.mediaPartnerService.getPartnerIds()),
          ...(await this.billboardService.getPartnerIds()),
        ]),
      ),
    };
  }
}
