import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BillboardService } from '../service/billboard.service';

@ApiTags('Billboard')
@Controller('billboard')
export class BillboardController {
  constructor(private readonly billboardService: BillboardService) {}
}
