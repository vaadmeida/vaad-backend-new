import { Controller } from '@nestjs/common';
import { BillboardService } from '../service/billboard.service';

@Controller('billboard')
export class BillboardController {
  constructor(private readonly billboardService: BillboardService) {}
}
