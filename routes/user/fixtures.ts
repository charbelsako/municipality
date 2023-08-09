import User from '../../models/User';

export const userData = {
  username: 'testuser',
  password: 'hashedPassword',
  refreshToken: null,
};

export const mockUser = new User(userData);
mockUser.save = jest.fn().mockResolvedValue(mockUser);

// Mock User.findOne to return a valid user
User.findOne = jest.fn().mockResolvedValue(mockUser);
