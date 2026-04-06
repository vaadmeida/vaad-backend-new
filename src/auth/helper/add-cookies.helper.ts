import { CookieOptions, Response } from 'express';

export const addCookieResponse = (
  response: Response,
  tokens: { accessToken: string; refreshToken: string },
  data: any = {},
) => {
  const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  };

  response.cookie('accessToken', tokens.accessToken, cookieOptions);

  response.cookie('refreshToken', tokens.refreshToken, cookieOptions);

  return response.json({ status: 'SUCCESS', data: { ...data, tokens } });
};
