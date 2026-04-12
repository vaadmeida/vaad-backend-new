import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart } from '../schema/cart.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private readonly CartModel: Model<Cart>,
  ) {}

  async addToCart(payload: Partial<Cart>): Promise<Cart> {
    if (
      await this.CartModel.exists({
        userId: payload.userId,
        billboard: payload.billboard,
      })
    ) {
      throw new BadRequestException('Billboard already added to cart');
    }

    return this.CartModel.create(payload);
  }

  async updateCart(id: string, payload: Partial<Cart>): Promise<Cart> {
    return this.CartModel.findByIdAndUpdate(
      id,
      { $set: payload },
      { returnDocument: 'after' },
    )
      .orFail(new NotFoundException('Cart item not found'))
      .populate('billboard');
  }

  async getUserCart(userId: string): Promise<Cart[]> {
    return this.CartModel.find({ userId }).populate('billboard');
  }

  async deleteCartItem(_id: string, userId: string): Promise<Cart> {
    return this.CartModel.findOneAndDelete({ _id, userId }).orFail(
      new NotFoundException('Cart item not found'),
    );
  }

  async emptyUserCart(userId: string) {
    await this.CartModel.deleteMany({ userId });
  }
}
