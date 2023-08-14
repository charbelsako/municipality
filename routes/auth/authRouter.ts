import express, { Request, Response } from 'express';
import { verifyJWT } from '../../middleware/verifyJWT';
import {
  handleLogin,
  handleLogout,
  handleRefreshToken,
} from './authController';
import ac from '../../accesscontrol/setup';

const router = express.Router();

/**
 * @route /api/v1/auth/login
 * @desc logs a user in and creates tokens
 * @access public
 * @method POST
 */
router.post('/login', handleLogin);

/**
 * @route /api/v1/auth/login
 * @desc logs a user in and creates tokens
 * @access public
 * @method POST
 */
router.get('/refresh', handleRefreshToken);

/**
 * @route /api/v1/auth/logout
 * @desc logs a user out and removes cookie and refresh token
 * @access public
 * @method POST
 */
router.get('/logout', handleLogout);

/**
 * just for testing that protection works with role
 */
router.use(verifyJWT);
router.get('/protected', (req: Request, res: Response) => {
  const permission = ac.can(req.user.role).createOwn('admin');
  if (!permission.granted) {
    return res.send('You do not have permission to access this resource');
  }
  res.send('working');
});

export default router;
