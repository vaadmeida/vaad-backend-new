import { Body, Controller, Post } from '@nestjs/common';
import { MediaPlanRequestService } from '../service/media-plan-request.service';
import { MediaPlanRequest } from '../schema/media-plan-request.schema';
import { ApiTags } from '@nestjs/swagger';
import { RequestMediaPlanDTO } from '../dto/media-request.dto';
import { ConsultationRequestService } from '../service/consultation-request.service';
import { ConsultationRequest } from '../schema/consultation-request.schema';
import { RequestConsultationDTO } from '../dto/consulation-request.dto';

@ApiTags('Requests')
@Controller('requests')
export class RequestController {
  constructor(
    private readonly requestService: MediaPlanRequestService,
    private readonly consultationRequestService: ConsultationRequestService,
  ) {}

  @Post('media-plans')
  async createMediaPlanRequest(
    @Body() media: RequestMediaPlanDTO,
  ): Promise<MediaPlanRequest> {
    return this.requestService.createMedia(media);
  }

  @Post('consultations')
  async createConsultationRequest(
    @Body() consultation: RequestConsultationDTO,
  ): Promise<ConsultationRequest> {
    return this.consultationRequestService.createConsultationRequest(
      consultation,
    );
  }
}
