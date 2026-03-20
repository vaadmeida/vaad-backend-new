import { Body, Controller, Post } from '@nestjs/common';
import { MediaPlanRequestService } from '../service/request.service';
import { MediaPlanRequest } from '../schema/media-plan-request.schema';

@Controller('requests')
export class RequestController {
  constructor(private readonly requestService: MediaPlanRequestService) {}

  @Post('media-plans')
  async createMediaPlanRequest(@Body() media: Partial<MediaPlanRequest>) {
    return this.requestService.createMedia(media);
  }
}
