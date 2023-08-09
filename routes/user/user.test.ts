import { handleCreateAdmin, handleCreateCitizen } from './userController';
import { statusCodes } from '../../constants';
import { mockCitizenData } from './fixtures';
import { res } from '../../fixtures';
import User from '../../models/User';
import bcrypt from 'bcrypt';

jest.spyOn(bcrypt, 'genSalt').mockResolvedValue(<never>'few');
jest.spyOn(bcrypt, 'hash').mockResolvedValue(<never>'hashedPassword');

const mockCitizenUser = new User(mockCitizenData);
jest.spyOn(User.prototype, 'save').mockResolvedValue(mockCitizenUser);

afterEach(() => {
  jest.clearAllMocks();
});

describe('User Routes', () => {
  it('Should create a citizen user', async () => {
    const req: any = {
      body: mockCitizenData,
    };
    await handleCreateCitizen(req, res);

    expect(res.send).toHaveBeenCalledTimes(1);
    // expect(res.send).toHaveBeenCalledWith({});
    expect(res.status).toHaveBeenCalledWith(200);
  });
  it('Should create an admin user', async () => {});
});
