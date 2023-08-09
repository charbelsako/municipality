import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const accessTokenString: any = 'mockAccessToken';
// Mock bcrypt.compare to always return true for testing purposes
jest.spyOn(bcrypt, 'compare').mockResolvedValue(<never>true);
// Mock jwt.sign to return a mock token
jest.spyOn(jwt, 'sign').mockReturnValue(accessTokenString);

export const newAccessToken = {
  data: { accessToken: 'mockAccessToken' },
  success: true,
};
