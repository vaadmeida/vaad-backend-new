import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Token } from '@app/util';
import type { TokenDto } from '@app/util/auth/dto/token.dto';
import { OrderItemDTO } from '../dto/order.dto';
import { CartService } from '../service/cart.service';

@ApiTags('Carts')
@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Token() { identifier }: TokenDto) {
    return { carts: await this.cartService.getUserCart(identifier) };
  }

  @Post()
  addToCart(
    @Body() { billboardId, ...cartItem }: OrderItemDTO,
    @Token() { identifier }: TokenDto,
  ) {
    return this.cartService.addToCart({
      userId: identifier,
      billboard: billboardId,
      ...cartItem,
    });
  }

  @Patch('id')
  updateCart(
    @Param('id') id: string,
    @Body() cartItem: OrderItemDTO,
    @Token() { identifier }: TokenDto,
  ) {
    return this.cartService.updateCart(id, { userId: identifier, ...cartItem });
  }

  @Delete('id')
  async deleteCart(@Param('id') id: string, @Token() { identifier }: TokenDto) {
    await this.cartService.deleteCartItem(id, identifier);

    return { success: true };
  }
}
