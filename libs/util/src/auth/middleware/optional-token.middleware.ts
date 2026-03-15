import {
  BadRequestException,
  Injectable,
  Logger,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../service/token.service';
import { CacheService } from '../../cache/service/cache.services';
import { TokenDto } from '../dto/token.dto';

@Injectable()
export class OptionalTokenMiddleware implements NestMiddleware {
  private readonly logger = new Logger(OptionalTokenMiddleware.name);
  constructor(
    private readonly tokenService: TokenService,
    private readonly cacheService: CacheService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = this.tokenService.getToken(req);

      if (token) {
        const { identifier } = await this.tokenService.verifyToken(token);

        if (!identifier) {
          throw new BadRequestException('please provide a valid JWT token');
        }
        this.logger.debug({ identifier });
        const rawTokenData = await this.cacheService.get(identifier);
        const tokenData = JSON.parse(rawTokenData) as TokenDto;

        res.locals.tokenData = tokenData;
      }
      next();
    } catch (error) {
      this.logger.error(error);
      next();
    }
  }
}
