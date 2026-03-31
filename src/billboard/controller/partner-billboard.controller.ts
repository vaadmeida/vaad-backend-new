import {
  Body,
  Controller,
  Delete,
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
import {
  LikeBillboardDto,
  UpdateBillboardDTO,
} from '../dto/update-billboard.dto';
import { FavoriteBillboardService } from './../service/favorite-billboard.service';
import { Token } from '@app/util';
import type { TokenDto } from '@app/util/auth/dto/token.dto';

@ApiTags('Media Partner Billboards')
@Controller('billboards/media-partners')
export class MediaPartnerBillboardController {
  constructor(
    private readonly billboardService: BillboardService,
    private readonly favoriteBillboardService: FavoriteBillboardService,
  ) {}

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

  @Delete('/admins')
  deleteBillboard(@Body() payload: CreateBillboardDTO) {
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
    @Token() token: TokenDto,
  ) {
    return this.billboardService.searchBillboards(
      payload,
      pg,
      token?.identifier,
    );
  }

  @Get('/:id')
  oneBillboard(@Param('id') id: string) {
    return this.billboardService.getOneBillboard(id);
  }

  @Post('favorite')
  likeBillboard(
    @Token() { identifier }: TokenDto,
    @Body() { billboardId }: LikeBillboardDto,
  ) {
    console.log({ identifier, billboardId });
    return this.favoriteBillboardService.saveFavorite(identifier, billboardId);
  }
}
