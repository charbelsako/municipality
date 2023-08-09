import { handleLogin } from './authController';
import User from '../../models/User'; // Import your User model
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { statusCodes } from '../../constants';

// Fixtures
const mockUser = new User({
  username: 'testuser',
  password: 'hashedPassword',
  refreshToken: null,
});
// Mock User.findOne to return a valid user
User.findOne = jest.fn().mockResolvedValueOnce(mockUser);
mockUser.save = jest.fn().mockResolvedValue(mockUser);
// Mock bcrypt.compare to always return true for testing purposes
jest.spyOn(bcrypt, 'compare').mockResolvedValue(<never>true);
// Mock jwt.sign to return a mock token
jest.spyOn(jwt, 'sign').mockReturnValue(<any>'mockAccessToken');
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

afterEach(() => {
  jest.clearAllMocks();
});

describe('Login Route', () => {
  it('should handle successful login', async () => {
    const req: any = {
      body: { username: 'testuser', password: 'password' },
    };
    await handleLogin(req, res);

    expect(sendMock).toHaveBeenCalledWith({
      data: { accessToken: 'mockAccessToken' },
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
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(<never>true);
    await handleLogin(req, res);
    expect(res.sendStatus).toHaveBeenCalledWith(statusCodes.UNAUTHORIZED);
  });
});
