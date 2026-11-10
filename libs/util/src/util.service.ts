import { Logger, Injectable } from '@nestjs/common';

@Injectable()
export class UtilService {
  private readonly logger = new Logger(UtilService.name);
}
