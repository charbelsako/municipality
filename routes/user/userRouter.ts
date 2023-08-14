import express from 'express';
import { verifyJWT } from '../../middleware/verifyJWT';
import {
  handleChangeUserRole,
  handleCreateAdmin,
  handleCreateCitizen,
} from './userController';

const router = express.Router();

/**
 * @route /api/v1/auth/create-admin
 * @desc Creates an admin user (employee)
 * @access private (Super admin)
 * @method POST
 */
router.post('/create-admin', verifyJWT, handleCreateAdmin);

/**
 * @route /api/v1/auth/create-citizen
 * @desc creates a normal citizen account
 * @access Admins only
 * @method POST
 */
router.post('/create-citizen', handleCreateCitizen);

/**
 * @route /api/v1/user/change-role
 * @desc changes a role of any user
 * @access Super Admins only
 * @method POST
 */
router.post('/change-role', verifyJWT, handleChangeUserRole);

export default router;
