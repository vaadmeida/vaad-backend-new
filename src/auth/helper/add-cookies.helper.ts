import { Response } from 'express';

export const addCookieResponse = (
  response: Response,
  tokens: { accessToken: string; refreshToken: string },
  data: any = {},
) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  response.cookie('accessToken', tokens.accessToken, cookieOptions);

  response.cookie('refreshToken', tokens.refreshToken, cookieOptions);

  return response.json({ status: 'SUCCESS', data: { ...data, tokens } });
};
