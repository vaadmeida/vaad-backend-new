import { RolesEnum } from '../enum/roles.enum';

export type TokenData = { email: string; role: RolesEnum };

export type TokenDto = {
  identifier: string;
  data: TokenData;
};
