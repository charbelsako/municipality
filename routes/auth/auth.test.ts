import { handleLogin, handleRefreshToken } from './authController';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { statusCodes } from '../../constants';
import { res } from '../../fixtures';
import { userData } from '../user/fixtures';
import { accessTokenString, newAccessToken } from './fixtures';
import User from '../../models/User';

const mockUser = new User(userData);
// this is used after fetching the user with .findOne
mockUser.save = jest.fn().mockResolvedValue(mockUser);

User.findOne = jest.fn().mockResolvedValue(mockUser);

// Mock bcrypt.compare to always return true for testing purposes
jest.spyOn(bcrypt, 'compare').mockResolvedValue(<never>true);
// Mock jwt.sign to return a mock token
jest.spyOn(jwt, 'sign').mockReturnValue(accessTokenString);

afterEach(() => {
  jest.clearAllMocks();
});

describe('Authentication Tests', () => {
  describe('Login Route', () => {
    it('should handle successful login', async () => {
      const req: any = {
        body: { username: userData.username, password: userData.password },
      };
      await handleLogin(req, res);

      expect(res.send).toHaveBeenCalledWith({
        data: { accessToken: accessTokenString },
        success: true,
      });
    });

    it('Should fail if password is not passed', async () => {
      const req: any = {
        body: { username: 'testuser' },
      };
      await handleLogin(req, res);
      expect(res.status).toHaveBeenCalledWith(statusCodes.BAD_REQUEST);
      expect(res.status).toHaveBeenCalledTimes(1);
    });

    it('Should fail if username is not passed', async () => {
      const reqNoUsername: any = {
        body: { password: 'thisIsAPassword' },
      };
      await handleLogin(reqNoUsername, res);
      expect(res.status).toHaveBeenCalledWith(statusCodes.BAD_REQUEST);
      expect(res.status).toHaveBeenCalledTimes(1);
    });

    it('Should fail if password is wrong', async () => {
      const req: any = {
        body: { username: 'someone', password: 'thisIsAPassword' },
      };
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(<never>false);
      await handleLogin(req, res);
      expect(res.sendStatus).toHaveBeenCalledWith(statusCodes.UNAUTHORIZED);
    });
  });

  describe('Refresh Token Route', () => {
    it('Should get a new refresh token', async () => {
      const req: any = {
        cookies: { refreshToken: 'refreshToken' },
      };
      jest
        .spyOn(jwt, 'verify')
        .mockReturnValue(<any>{ username: userData.username });

      await handleRefreshToken(req, res);
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith(newAccessToken);
    });

    it('Should not get a new refresh token if username does not match', async () => {
      const req: any = {
        cookies: { refreshToken: 'refreshToken' },
      };
      jest
        .spyOn(jwt, 'verify')
        .mockReturnValue(<any>{ username: 'nothing important' });

      await handleRefreshToken(req, res);

      expect(res.sendStatus).toHaveBeenCalledWith(statusCodes.FORBIDDEN);
    });
  });
});
