import { Request, Response } from 'express';
import User, { ROLES } from '../../models/User';
import { sendError, sendResponse } from '../../responseHandler';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validateSignUp } from '../../validators/signUpValidations';
import { cookieOptions, statusCodes } from '../../constants';
import { TokenData } from '../../middleware/verifyJWT';

export async function handleLogin(req: Request, res: Response) {
  try {
    console.log(1);
    const { username, password } = req.body;
    if (!username || !password)
      return sendError({
        res,
        error: { message: 'Username and password are required.' },
        code: 400,
      });
    console.log(2);

    const foundUser: any = await User.findOne({ username });
    if (!foundUser) return sendError({ res, code: 401 }); //Unauthorized

    // evaluate password
    const match = await bcrypt.compare(password, foundUser.password);
    console.log('Everything okay');
    if (!match) {
      return sendError({ res, code: 401 });
    }
    console.log('password match');
    // create JWTs
    const accessToken = jwt.sign(
      { username: username },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: '30s' }
    );
    console.log('access token created');
    const refreshToken = jwt.sign(
      { username },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: '1d' }
    );
    console.log('access token created');

    // ! TODO save refresh token
    foundUser.refreshToken = refreshToken;
    await foundUser.save();
    console.log('Everything is really okay');

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000,
    });
    console.log('Everything okay');
    sendResponse(res, { accessToken });
  } catch (loginError) {
    sendError({ res, error: loginError, code: 500 });
  }
}

export async function handleRefreshToken(req: Request, res: Response) {
  try {
    const cookies = req.cookies;
    if (!cookies?.refreshToken) return sendError({ res, code: 401 });

    const refreshToken = cookies.refreshToken;

    const foundUser = await User.findOne({ refreshToken });
    if (!foundUser) return sendError({ res, code: statusCodes.FORBIDDEN });

    const token = <TokenData>(
      await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string)
    );

    if (foundUser.username !== token.username)
      return sendError({ res, code: statusCodes.FORBIDDEN });

    const accessToken = await jwt.sign(
      { username: token.username },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: '30s' }
    );

    sendResponse(res, { accessToken });
  } catch (refreshTokenError) {
    sendError({ res, error: refreshTokenError, code: 500 });
  }
}

export async function handleLogout(req: Request, res: Response) {
  try {
    const cookies = req.cookies;
    if (!cookies?.refreshToken) return res.sendStatus(statusCodes.NO_CONTENT);

    const refreshToken = cookies.refreshToken;

    const foundUser = await User.findOne({ refreshToken });
    if (!foundUser) {
      res.clearCookie('refreshToken', cookieOptions);
      return res.sendStatus(statusCodes.NO_CONTENT);
    }

    // Delete the refresh token
    await User.findOneAndUpdate(
      { username: foundUser.username },
      { $unset: { refreshToken: 1 } }
    );

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    res.sendStatus(statusCodes.NO_CONTENT);
    // const token = <TokenData>(
    //   await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string)
    // );

    // if (foundUser.username !== token.username)
    //   return sendError({ res, code: statusCodes.FORBIDDEN });

    // const accessToken = await jwt.sign(
    //   { username: token.username },
    //   process.env.ACCESS_TOKEN_SECRET as string,
    //   { expiresIn: '30s' }
    // );

    // sendResponse(res, { accessToken });
  } catch (refreshTokenError) {
    sendError({ res, error: refreshTokenError, code: 500 });
  }
}
