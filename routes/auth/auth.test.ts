import { handleLogin, handleRefreshToken } from './authController';
import User from '../../models/User'; // Import your User model
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { statusCodes } from '../../constants';

// Fixtures
const userData = {
  username: 'testuser',
  password: 'hashedPassword',
  refreshToken: null,
};
const accessTokenString: any = 'mockAccessToken';
const mockUser = new User(userData);
// Mock User.findOne to return a valid user
User.findOne = jest.fn().mockResolvedValue(mockUser);
mockUser.save = jest.fn().mockResolvedValue(mockUser);
// Mock bcrypt.compare to always return true for testing purposes
jest.spyOn(bcrypt, 'compare').mockResolvedValue(<never>true);
// Mock jwt.sign to return a mock token
jest.spyOn(jwt, 'sign').mockReturnValue(accessTokenString);
let sendMock = jest.fn();
const cookieMock = jest.fn();
let statusMock = jest.fn(() => ({ send: sendMock }));
let sendStatusMock = jest.fn(() => ({ send: sendMock }));
const res: any = {
  send: sendMock,
  status: statusMock,
  json: jest.fn(),
  cookie: cookieMock,
  sendStatus: sendStatusMock,
};
const newAccessToken = {
  data: { accessToken: 'mockAccessToken' },
  success: true,
};

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

      expect(sendMock).toHaveBeenCalledWith({
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
