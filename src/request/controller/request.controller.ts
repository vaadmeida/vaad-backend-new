import { Body, Controller, Post } from '@nestjs/common';
import { MediaPlanRequestService } from '../service/request.service';
import { MediaPlanRequest } from '../schema/media-plan-request.schema';
import { ApiTags } from '@nestjs/swagger';
import { RequestMediaPlanDTO } from '../dto/media-request.dto';

@ApiTags('Requests')
@Controller('requests')
export class RequestController {
  constructor(private readonly requestService: MediaPlanRequestService) {}

  @Post('media-plans')
  async createMediaPlanRequest(
    @Body() media: RequestMediaPlanDTO,
  ): Promise<MediaPlanRequest> {
    return this.requestService.createMedia(media);
  }
}
