import express from 'express';
import { verifyJWT } from '../../middleware/verifyJWT';
import {
  handleCreateAdmin,
  handleCreateCitizen,
  handleUpdatePassword,
} from './userController';

const router = express.Router();

/**
 * @route /api/v1/user/create-admin
 * @desc Creates an admin user (employee)
 * @access private (Super admin)
 * @method POST
 */
router.post('/create-admin', verifyJWT, handleCreateAdmin);

/**
 * @route /api/v1/user/create-citizen
 * @desc creates a normal citizen account
 * @access Admins only
 * @method POST
 */
router.post('/create-citizen', verifyJWT, handleCreateCitizen);

/**
 * @route /api/v1/user/handleUpdatePassword
 * @desc update the password of a user
 * @access All signed in users
 * @method POST
 */
router.post('/update-password', verifyJWT, handleUpdatePassword);

export default router;
