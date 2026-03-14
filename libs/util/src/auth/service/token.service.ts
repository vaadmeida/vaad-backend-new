import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
import { TokenConfig } from '../enum/env.enum';

@Injectable()
export class TokenService {
  private expiresIn: any;
  private refreshTokenExpiration: string;
  private readonly logger = new Logger(TokenService.name);

  constructor(private config: ConfigService) {
    this.expiresIn = '1 days';
  }

  signToken(identifier: string): Promise<string> {
    const tokenSecret = this.config.getOrThrow(TokenConfig.TOKEN_SECRET);

    return new Promise((resolve, reject) => {
      jwt.sign(
        { identifier },
        tokenSecret,
        { expiresIn: this.expiresIn },
        (err: any, encoded: string) => {
          if (err) reject(new InternalServerErrorException(err));
          resolve(encoded);
        },
      );
    });
  }

  verifyExpiredToken(token: string) {
    return new Promise((resolve, reject) => {
      const tokenSecret = this.config.getOrThrow(TokenConfig.TOKEN_SECRET);
      jwt.verify(
        token,
        tokenSecret,
        { ignoreExpiration: true },
        (err: any, decoded) => {
          if (err) reject(new UnauthorizedException(err.message));
          resolve(decoded);
        },
      );
    });
  }

  refreshToken({
    id,
    expiresIn = '1 days',
  }: {
    id: string;
    expiresIn?: any;
  }): Promise<string> {
    return new Promise((resolve, reject) => {
      const tokenSecret = this.config.get(TokenConfig.REFRESH_TOKEN_SECRET);

      jwt.sign({ id }, tokenSecret, { expiresIn }, (err, decoded) => {
        if (err) reject(new InternalServerErrorException(err));

        resolve(decoded as string);
      });
    });
  }

  async verifyRefreshToken(token: string): Promise<any> {
    const tokenSecret = this.config.get(TokenConfig.REFRESH_TOKEN_SECRET);
    try {
      const decoded = await jwt.decode(token, tokenSecret);
      return decoded;
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }

  verifyToken(token: string): Promise<{ identifier: string }> {
    return new Promise((resolve, reject) => {
      const tokenSecret = this.config.getOrThrow(TokenConfig.TOKEN_SECRET);

      jwt.verify(token, tokenSecret, (err, data: any) => {
        if (err) {
          if (err.name === 'TokenExpiredError') {
            reject(new BadRequestException('Token expired'));
          }
          reject(new BadRequestException(err.message));
        }
        resolve(data);
      });
    });
  }

  // decode(token: string) {
  //   return jwt.decode(token, { complete: true });
  // }

  getToken = (req: Request) => {
    let token: string = '';

    switch (true) {
      case !!req.headers.cookie:
        req.headers.cookie.split('; ').forEach((item) => {
          const data = item.split('=');
          if (data[0] === 'token') token = data[1];
        });
        break;
      case req.headers.authorization?.startsWith('Bearer'):
        token = req.headers?.authorization?.split(' ')[1] as string;
        break;
      case !!req.signedCookies?.token:
        token = req.signedCookies?.token;
        break;
    }

    return token;
  };
}
