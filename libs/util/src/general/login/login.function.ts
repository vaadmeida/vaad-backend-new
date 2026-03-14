import { Response } from 'express';

export const addCookieResponse = (
  response: Response,
  accessToken: string,
  data: any,
) => {
  response.cookie('token', accessToken /**{ signed: true, httpOnly: true } */);

  return response.json({ status: 'SUCCESS', data });
};
