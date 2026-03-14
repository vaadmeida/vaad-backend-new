import * as Joi from 'joi';
import { EnvConfigEnum } from './env.enum';

export const envConfigValidator = Joi.object<{ [key: string]: EnvConfigEnum }>({
  [EnvConfigEnum.PORT]: Joi.number().required(),
  [EnvConfigEnum.SESSION_SECRET]: Joi.string().required(),
  [EnvConfigEnum.TOKEN_SECRET]: Joi.string().required(),
  REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
  REFRESH_TOKEN_SECRET: Joi.string().required(),
  REDIS_HOST: Joi.string().required(),
});
