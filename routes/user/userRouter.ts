import express from 'express';
import { verifyJWT } from '../../middleware/verifyJWT';
import { handleCreateAdmin } from './userController';
const router = express.Router();

/**
 * @route /api/v1/auth/create-admin
 * @desc Creates an admin user (employee)
 * @access private (Super admin)
 * @method POST
 */
router.post('/create-admin', handleCreateAdmin);

/**
 * @route /api/v1/auth/create-citizen
 * @desc creates a normal citizen account
 * @access Admins only
 * @method POST
 */
router.post('/create-citizen', verifyJWT, (req, res) => {
  res.send('Not implemented yet');
});

export default router;
