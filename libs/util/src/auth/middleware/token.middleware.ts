import {
  Injectable,
  Logger,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../service/token.service';
import { CacheService } from '../../cache/service/cache.services';
import { TokenDataDto } from '../dto/token.dto';

@Injectable()
export class TokenMiddleware implements NestMiddleware {
  private readonly logger = new Logger(TokenMiddleware.name);
  constructor(
    private readonly tokenService: TokenService,
    private readonly cacheService: CacheService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = this.tokenService.getToken(req);

      if (!token) {
        throw new UnauthorizedException('Invalid token');
      }
      const verifiedToken = await this.tokenService.verifyToken(token);

      if (!verifiedToken.identifier) {
        throw new UnauthorizedException('Invalid token');
      }

      const tokenData: TokenDataDto = await this.cacheService.getOrThrowError(
        verifiedToken.identifier,
      );

      res.locals.tokenData = tokenData;
      next();
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException(error.message);
    }
  }
}
