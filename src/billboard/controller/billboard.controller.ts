import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateBillboardDTO,
  PaginationFilter,
  SearchBillboardFilter,
} from '../dto/billboard.dto';
import { BillboardService } from '../service/billboard.service';
import { UpdateBillboardDTO } from '../dto/update-billboard.dto';

@ApiTags('Billboards')
@Controller('billboards')
export class BillboardController {
  constructor(private readonly billboardService: BillboardService) {}
  @Get('/assets')
  assets() {
    return this.billboardService.assets();
  }

  @Post('/admins')
  adminCreateBillboard(@Body() payload: CreateBillboardDTO) {
    return this.billboardService.createBillboard(payload);
  }

  @Patch('/:id')
  adminUpdateBillboard(
    @Param('id') id: string,
    @Body() payload: UpdateBillboardDTO,
  ) {
    return this.billboardService.updateBillboard(id, payload);
  }

  @Post('/partners')
  partnerCreateBillboard(@Body() payload: CreateBillboardDTO) {
    return this.billboardService.createBillboard(payload);
  }

  @Get('/search')
  searchBillboards(
    @Query() payload: SearchBillboardFilter,
    @Query() pg: PaginationFilter,
  ) {
    return this.billboardService.searchBillboards(payload, pg);
  }

  @Get('/:id')
  oneBillboard(@Param('id') id: string) {
    return this.billboardService.getOneBillboard(id);
  }
}
