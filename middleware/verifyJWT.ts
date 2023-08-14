import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { sendStatus } from '../responseHandler';
import { statusCodes } from '../constants';
import { User } from '../types';

declare module 'express-serve-static-core' {
  interface Request {
    user: User;
  }
}

export interface TokenData {
  email: string;
  role: string;
}

export async function verifyJWT(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (process.env.NODE_ENV === 'test') next();
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.sendStatus(401);

    const token: string = authHeader.split(' ')[1];
    const decoded = await jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    );
    req.user = <TokenData>decoded;
    next();
  } catch (verifyJWTError) {
    sendStatus(res, statusCodes.FORBIDDEN);
  }
}
