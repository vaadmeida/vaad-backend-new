import { Controller } from '@nestjs/common';
import { RequestService } from '../service/request.service';

@Controller('request')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}
}
