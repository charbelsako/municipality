import express from 'express';
import { verifyJWT } from '../../middleware/verifyJWT';
import {
  handleAddUserRole,
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
 * @route /api/v1/user/add-role
 * @desc adds a role to any user
 * @access Super Admins only
 * @method POST
 */
router.post('/add-role', verifyJWT, handleAddUserRole);

export default router;
