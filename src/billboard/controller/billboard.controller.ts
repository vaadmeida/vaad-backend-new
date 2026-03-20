import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateBillboardDTO,
  PaginationFilter,
  SearchBillboardFilter,
} from '../dto/billboard.dto';
import { BillboardService } from '../service/billboard.service';

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
}
