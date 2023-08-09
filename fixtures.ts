import User from './models/User';
import { userData } from './routes/user/fixtures';

export const sendMock = jest.fn();
export const cookieMock = jest.fn();
export const statusMock = jest.fn(() => ({ send: sendMock }));
export const sendStatusMock = jest.fn(() => ({ send: sendMock }));

export const res: any = {
  send: sendMock,
  status: statusMock,
  json: jest.fn(),
  cookie: cookieMock,
  sendStatus: sendStatusMock,
};
