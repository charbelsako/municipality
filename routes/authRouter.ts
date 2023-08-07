import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User, { ROLES } from '../models/User';
import jwt from 'jsonwebtoken';
import { sendError, sendResponse } from '../responseHandler';
import { verifyJWT } from '../middleware/verifyJWT';
import { validateSignUp } from '../validators/signUpValidations';

const router = express.Router();

/**
 * @route /api/v1/auth/create-admin
 * @desc Creates an admin user (employee)
 * @access private (Super admin)
 * @method POST
 */
router.post('/create-admin', async (req, res) => {
  try {
    const { username, password, phoneNumbers, name, idNumber, role } = req.body;

    const validationError = validateSignUp({
      username,
      password,
      name,
      idNumber,
      phoneNumberList: phoneNumbers,
      role: role,
    });

    if (!validationError.isValid) {
      return sendError(res, validationError, 400);
    }

    // encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = new User({
      idNumber,
      username,
      password: hashedPassword,
      phoneNumberList: phoneNumbers,
      name: name,
      role: ROLES.ADMIN,
    });
    await userData.save();
    sendResponse(res, userData);
  } catch (signUpError) {
    sendError(res, signUpError, 500);
  }
});

/**
 * @route /api/v1/auth/login
 * @desc logs a user in and creates tokens
 * @access public
 * @method POST
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res
        .status(400)
        .json({ message: 'Username and password are required.' });
    const foundUser: any = await User.findOne({ username });
    if (!foundUser) return res.sendStatus(401); //Unauthorized

    // evaluate password
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
      // create JWTs
      const accessToken = jwt.sign(
        { username: username },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: '30s' }
      );
      const refreshToken = jwt.sign(
        { username },
        process.env.REFRESH_TOKEN_SECRET as string,
        { expiresIn: '1d' }
      );
      // ! TODO save refresh token

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.json({ accessToken });
    } else {
      return res.sendStatus(401);
    }
  } catch (loginError) {
    sendError(res, loginError, 500);
  }
});

/**
 * @route /api/v1/auth/create-citizen
 * @desc creates a normal citizen account
 * @access Admins only
 * @method POST
 */
router.post('/create-citizen', verifyJWT, (req, res) => {
  res.send('Not implemented yet');
});

router.use(verifyJWT);
router.get('/protected', (req: Request, res: Response) => {
  res.send('working');
});

export default router;
