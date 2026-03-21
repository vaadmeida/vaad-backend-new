import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';

import { Response } from 'express';
import { TokenDto } from '../dto/token.dto';

export const Token = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): TokenDto => {
    const response: Response = ctx.switchToHttp().getResponse();
    return response.locals.tokenData as TokenDto;
  },
);

export const UseToken = () => SetMetadata('token', true);
