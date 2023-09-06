import express from 'express';
import { verifyJWT } from '../../middleware/verifyJWT';
import {
  handleUpdatePassword,
  handleChangeUserRole,
  handleCreateAdmin,
  handleCreateCitizen,
  handleUpdateUser,
  getUserProfile,
  handleResetPasswordRequest,
  handleResetPassword,
  handleGetAllUsers,
  handleDeleteUser,
  handleEnableUser,
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
router.post('/signup', handleCreateCitizen);

/**
 * @route /api/v1/user/update-password
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

/**
 * @route /api/v1/user/reset-password-request
 * @desc Submits a request to reset a user's own password
 * @access Public
 * @method POST
 */
router.post('/reset-password', handleResetPasswordRequest);

/**
 * @route /api/v1/user/reset-password
 * @desc Validates token and resets a user's own password
 * @access Public
 * @method POST
 */
router.post('/reset-password', handleResetPassword);

/**
 * @route /api/v1/user/all
 * @desc retrieves all users
 * @access Super Admins only
 * @method GET
 */
router.get('/all', verifyJWT, handleGetAllUsers);

/**
 * @route /api/v1/user/:id/delete
 * @desc Sets a user as deleted and disallows login
 * @access Admins only
 * @method DELETE
 */
router.delete('/:id/delete', verifyJWT, handleDeleteUser);

/**
 * @route /api/v1/user/:id/enable
 * @desc Sets a user as not deleted
 * @access Admins only
 * @method PATCH
 */
router.patch('/:id/enable', verifyJWT, handleEnableUser);

export default router;
