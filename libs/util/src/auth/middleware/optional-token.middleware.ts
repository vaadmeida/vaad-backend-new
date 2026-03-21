import {
  BadRequestException,
  Injectable,
  Logger,
  NestMiddleware,
  UnauthorizedException,
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
      this.logger.debug('Token found: ', !!token);

      if (token) {
        const { identifier } = await this.tokenService.verifyToken(token);

        if (!identifier) {
          throw new BadRequestException('please provide a valid JWT token');
        }

        const verifiedToken = await this.tokenService.verifyToken(token);

        if (!verifiedToken.identifier) {
          throw new UnauthorizedException('Invalid token');
        }

        const tokenData: TokenDto = await this.cacheService.getOrThrowError(
          verifiedToken.identifier,
        );

        res.locals.tokenData = tokenData;
      }
      next();
    } catch (error) {
      this.logger.error(error);
      next();
    }
  }
}
