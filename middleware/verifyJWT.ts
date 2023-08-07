import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { sendError } from '../responseHandler';

declare module 'express-serve-static-core' {
  interface Request {
    user: string;
  }
}

export interface TokenData {
  username: string;
}

export async function verifyJWT(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.sendStatus(401);
    console.log(authHeader);

    const token: string = authHeader.split(' ')[1];
    const decoded = await jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    );
    req.user = (<TokenData>decoded).username;
    next();
  } catch (verifyJWTError) {
    sendError(res, verifyJWTError, 403);
  }
}