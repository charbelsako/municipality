import { handleCreateAdmin, handleCreateCitizen } from './userController';
import User from '../../models/User'; // Import your User model
import { statusCodes } from '../../constants';
import { res } from '../../fixtures';

describe('User Routes', () => {
  it('Should create an admin user', async () => {
    const req: any = {
      body: {
        username: 'nothing2',
        email: 'abin@abin.com',
        password: '12345678Ee#',
        name: {
          firstName: 'Abin',
          lastName: 'Punnoose',
          fatherName: 'Doe',
          motherName: 'Doe',
        },
        personalSect: 'مختلف',
        recordNumber: 2029,
        recordSect: 'مختلف',
        role: 'Citizen',
      },
    };
    await handleCreateAdmin(req, res);

    expect(res.send).toHaveBeenCalledTimes(1);
    // expect(res.send).toHaveBeenCalledWith({});
  });
  it('Should create a citizen user', async () => {});
});
