import express, { Request, Response } from 'express';
import { verifyJWT } from '../../middleware/verifyJWT';
import {
  handleLogin,
  handleLogout,
  handleRefreshToken,
} from './authController';

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

router.use(verifyJWT);
router.get('/protected', (req: Request, res: Response) => {
  res.send('working');
});

export default router;
