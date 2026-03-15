import { TokenService } from './token.service';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Auth } from '../model/auth.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { hash, verifyHash } from '../../general/function/password.function';
import { CacheService } from '../../cache/service/cache.services';
import { TokenDto } from '../dto/token.dto';
import { RolesEnum } from '../enum/roles.enum';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @InjectModel(Auth.name) private readonly AuthModel: Model<Auth>,
    private readonly tokenService: TokenService,
    private readonly cacheService: CacheService,
  ) {}

  async signUp(identifier: string, password: string, roles: RolesEnum[] = []) {
    const [hashPass, exitingIdentifier] = await Promise.all([
      hash(password),
      this.AuthModel.exists({ identifier }),
    ]);

    if (exitingIdentifier) {
      throw new BadRequestException('Identifier already exist');
    }
    const { _id } = await this.AuthModel.create({
      password: hashPass,
      identifier,
      roles,
    });
    try {
      const [accessToken, refreshToken] = await Promise.all([
        this.tokenService.signToken(identifier),
        this.tokenService.refreshToken({ id: _id.toString() }),
        this.cacheService.set(identifier.toString(), 'active'),
      ]);

      return { accessToken, refreshToken };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async login(identifier: string, password: string, data: any = {}) {
    const account = await this.AuthModel.findOne({ identifier });

    if (!account) {
      throw new UnauthorizedException('Invalid credential');
    }

    const isValid = await verifyHash(account.password, password);

    if (!isValid) {
      throw new UnauthorizedException('Invalid credential');
    }

    const cacheData: TokenDto = {
      identifier,
      data,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signToken(identifier),
      this.tokenService.refreshToken({ id: account._id.toString() }),
      this.cacheService.set(identifier, cacheData),
    ]);

    return { accessToken, refreshToken };
  }

  async refreshToken(token: string) {
    const { id } = await this.tokenService.verifyRefreshToken(token);
    const account = await this.AuthModel.findById(id);
    if (!account) {
      throw new UnauthorizedException('Invalid credential');
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signToken(account.identifier),
      this.tokenService.refreshToken({ id: account._id.toString() }),
    ]);
    return { accessToken, refreshToken, identifier: account.identifier };
  }

  async changePassword(identifier: string, newPassword: string) {
    const [hashPass, account] = await Promise.all([
      hash(newPassword),
      this.AuthModel.findOne({ identifier }),
    ]);

    if (!account) {
      await this.AuthModel.create({ identifier, password: hashPass });
      return;
    }
    account.password = hashPass;

    await account.save();
  }

  async generateTokens(identifier: string, data: Record<string, string> = {}) {
    const account = await this.AuthModel.findOne({ identifier });
    if (!account) {
      throw new NotFoundException('Account not found for token generation');
    }

    const cacheData: TokenDto = {
      identifier,
      data,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signToken(account.identifier),
      this.tokenService.refreshToken({ id: account._id.toString() }),
      this.cacheService.set(identifier, cacheData),
    ]);
    return { accessToken, refreshToken, identifier: account.identifier };
  }
}
