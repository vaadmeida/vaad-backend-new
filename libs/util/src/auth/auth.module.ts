import { Global, Module } from '@nestjs/common';
import { TokenService } from './service/token.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth, AuthSchema } from './model/auth.model';
import { AuthService } from './service/auth.service';

@Global()
@Module({
  providers: [TokenService, AuthService],
  exports: [TokenService, AuthService],
  imports: [
    MongooseModule.forFeatureAsync([
      { name: Auth.name, useFactory: () => AuthSchema },
    ]),
  ],
})
export class AuthModule {}
