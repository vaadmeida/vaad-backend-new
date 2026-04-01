import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginationFilter, SearchBillboardFilter } from '../dto/billboard.dto';
import { BillboardService } from '../service/billboard.service';
import { LikeBillboardDto } from '../dto/update-billboard.dto';
import { FavoriteBillboardService } from '../service/favorite-billboard.service';
import { Token } from '@app/util';
import type { TokenDto } from '@app/util/auth/dto/token.dto';
import { BillboardMediaTypeEnum } from '../enum/billboard.enum';

@ApiTags('Billboards')
@Controller('billboards')
export class BillboardController {
  constructor(
    private readonly billboardService: BillboardService,
    private readonly favoriteBillboardService: FavoriteBillboardService,
  ) {}

  @Get('/assets')
  assets() {
    return this.billboardService.assets();
  }

  @Get('/explore')
  async searchBillboards(
    @Query() payload: SearchBillboardFilter,
    @Query() pg: PaginationFilter,
    @Token() token: TokenDto,
  ) {
    const result = await this.billboardService.searchBillboards(
      payload,
      { page: +pg.page, limit: +pg.limit },
      token?.identifier,
    );

    return { result };
  }

  @Get('/search')
  async ladingPageBillboards(
    @Query() payload: SearchBillboardFilter,
    @Token() token: TokenDto,
  ) {
    const result = await this.billboardService.searchBillboards(
      payload,
      { page: 1, limit: 500 },
      token?.identifier,
    );

    const landingPageBillboards = {
      [BillboardMediaTypeEnum.StaticBillboard]: result.foundItems.filter(
        (item) => item.mediaType === BillboardMediaTypeEnum.StaticBillboard,
      ),

      [BillboardMediaTypeEnum.LEDBillboard]: result.foundItems.filter(
        (item) => item.mediaType === BillboardMediaTypeEnum.LEDBillboard,
      ),

      [BillboardMediaTypeEnum.LamppostAdvertising]: result.foundItems.filter(
        (item) => item.mediaType === BillboardMediaTypeEnum.LamppostAdvertising,
      ),

      [BillboardMediaTypeEnum.AirportAdvertising]: result.foundItems.filter(
        (item) => item.mediaType === BillboardMediaTypeEnum.AirportAdvertising,
      ),
    };

    return { landingPageBillboards };
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
    return this.favoriteBillboardService.saveFavorite(identifier, billboardId);
  }
}
