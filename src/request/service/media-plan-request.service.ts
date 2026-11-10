import { Logger, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MediaPlanRequest } from '../schema/media-plan-request.schema';

@Injectable()
export class MediaPlanRequestService {
  private readonly logger = new Logger(MediaPlanRequestService.name);

  constructor(
    @InjectModel(MediaPlanRequest.name)
    private readonly MediaPlanRequestModel: Model<MediaPlanRequest>,
  ) {}

  async createMedia(media: Partial<MediaPlanRequest>) {
    return this.MediaPlanRequestModel.create(media);
  }
}
