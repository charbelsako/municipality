import express from 'express';
import { verifyJWT } from '../../middleware/verifyJWT';
import {
  handleUpdatePassword,
  handleChangeUserRole,
  handleCreateAdmin,
  handleCreateCitizen,
  handleUpdateUser,
  getUserProfile,
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
 * @route /api/v1/user/signup
 * @desc creates a normal citizen account
 * @access Public
 * @method POST
 */
router.post('/signup', verifyJWT, handleCreateCitizen);

/**
 * @route /api/v1/user/handleUpdatePassword
 * @desc update the password of a user
 * @access All signed in users
 * @method POST
 */
router.post('/update-password', verifyJWT, handleUpdatePassword);

/**
 * @route /api/v1/user/update-user
 * @desc update the user without touching password and role
 * @access All signed in users
 * @method POST
 * @params id is in the request from verifyJWT
 */
router.post('/update-user', verifyJWT, handleUpdateUser);

/**
 * @route /api/v1/user/profile
 * @desc Fetches the profile data of a user
 * @access All signed in users
 * @method POST
 * @params id is in the request from verifyJWT
 */
router.get('/profile', verifyJWT, getUserProfile);

/**
 * @route /api/v1/user/change-role
 * @desc changes a role of any user
 * @access SuperAdmins only
 * @method POST
 */
router.post('/change-role', verifyJWT, handleChangeUserRole);

export default router;
