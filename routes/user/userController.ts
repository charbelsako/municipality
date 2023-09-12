import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { validateSignUp } from '../../validators/signUpValidations';
import { sendError, sendResponse } from '../../responseHandler';
import User, { IUser, ROLES } from '../../models/User';
import { validateCreateCitizen } from '../../validators/createCitizenValidator';
import { statusCodes } from '../../constants';
import ac from '../../accesscontrol/setup';
import Token from '../../models/Token';
// import { sendEmail } from '../../utils/sendEmail';

export async function handleCreateAdmin(req: Request, res: Response) {
  try {
    const permission = ac.can(req.user.role).createAny('admin');

    if (!permission.granted) throw new Error('Cannot access this route');
    const {
      password,
      phoneNumbers,
      name,
      dateOfBirth,
      sex,
      personalSect,
      recordSect,
      recordNumber,
      email,
    } = req.body;

    const data = {
      email,
      password,
      name,
      phoneNumberList: phoneNumbers,
      dateOfBirth,
      personalInfo: { sect: personalSect },
      sex,
      recordInfo: { number: recordNumber, sect: recordSect },
      role: ROLES.ADMIN,
    };

    const validationData = {
      password,
      phoneNumbers,
      firstName: name?.firstName,
      motherName: name?.motherName,
      fatherName: name?.fatherName,
      lastName: name?.lastName,
      dateOfBirth,
      sex,
      personalSect,
      recordSect,
      recordNumber,
      email,
    };
    const validationError = validateCreateCitizen(validationData);

    if (!validationError.isValid) {
      return sendError({
        res,
        error: validationError,
        code: statusCodes.BAD_REQUEST,
      });
    }

    const userEmail = await User.findOne({ email });
    if (userEmail) throw new Error('Email already registered');

    // encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = new User({
      ...data,
      password: hashedPassword,
    });
    await userData.save();

    sendResponse(res, userData);
  } catch (signUpError) {
    sendError({ res, error: signUpError, code: statusCodes.SERVER_ERROR });
  }
}

export async function handleCreateCitizen(req: Request, res: Response) {
  try {
    const {
      password,
      phoneNumbers,
      name,
      dateOfBirth,
      sex,
      personalSect,
      recordSect,
      recordNumber,
      email,
    } = req.body;

    const data = {
      email,
      password,
      name,
      phoneNumberList: phoneNumbers,
      dateOfBirth,
      personalInfo: { sect: personalSect },
      sex,
      recordInfo: { number: recordNumber, sect: recordSect },
      role: ROLES.CITIZEN,
    };

    const validationData = {
      password,
      phoneNumbers,
      firstName: name?.firstName,
      motherName: name?.motherName,
      fatherName: name?.fatherName,
      lastName: name?.lastName,
      dateOfBirth,
      sex,
      personalSect,
      recordSect,
      recordNumber,
      email,
    };
    const validationError = validateCreateCitizen(validationData);

    if (!validationError.isValid) {
      return sendError({
        res,
        error: validationError.errors,
        code: statusCodes.BAD_REQUEST,
      });
    }

    const userEmail = await User.findOne({ email });
    if (userEmail) throw new Error('Email already registered');

    // encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = new User({ ...data, password: hashedPassword });
    await userData.save();

    sendResponse(res, userData);
  } catch (handleCreateCitizenErr) {
    console.log(handleCreateCitizenErr);
    sendError({
      res,
      error: handleCreateCitizenErr,
      code: statusCodes.SERVER_ERROR,
    });
  }
}

export async function handleUpdatePassword(req: Request, res: Response) {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).send('Invalid arguments');
    }
    // check if oldPassword matches
    const user = await User.findOne({ _id: req.user._id });
    if (!user) throw new Error('user not found');

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) throw new Error('current password is wrong');

    // encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.findOneAndUpdate(
      { _id: req.user._id },
      { password: hashedPassword },
      { new: true }
    );

    sendResponse(res, { message: 'Successfully changed password' });
  } catch (handleUpdatePasswordError) {
    sendError({
      res,
      error: handleUpdatePasswordError,
      code: statusCodes.SERVER_ERROR,
    });
  }
}

export async function handleResetPasswordRequest(req: Request, res: Response) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) throw new Error('User not in system');

    const token = await Token.findOne({ user: user._id });
    if (token) await Token.findByIdAndRemove(token._id);

    let resetToken = randomBytes(32).toString('hex');
    const salt = await bcrypt.genSalt(10);
    let hashedToken = await bcrypt.hash(resetToken, salt);

    let newToken = new Token({
      user: user._id,
      token: hashedToken,
      createdAt: Date.now(),
    });
    await newToken.save();

    const link = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}&id=${user._id}`;

    // sendEmail(user.email, link);
    sendResponse(res, { message: 'Email sent successfully' });
  } catch (err) {
    sendError({ res, error: err, code: 500 });
  }
}

export async function handleResetPassword(req: Request, res: Response) {
  try {
    const { token, user, password } = req.body;

    const resetToken = await Token.findOne({ user: user });
    if (!resetToken) throw new Error('Invalid or expired token');

    const isValid = await bcrypt.compare(token, resetToken.token);
    if (!isValid) {
      throw new Error('Invalid or expired token');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    await User.findByIdAndUpdate(user, { password: hash });

    // sendEmail(user.email, 'Changed password');
    sendResponse(res, { message: 'Success, updated password' });
  } catch (err) {
    sendError({ res, error: err, code: 500 });
  }
}

export async function handleChangeUserRole(req: Request, res: Response) {
  try {
    const permission = ac.can(req.user.role).updateAny('user-role');
    if (!permission.granted) throw new Error('can not access resource');

    const { id, role } = req.body;

    const user = await User.findByIdAndUpdate(id, { role }, { new: true });
    if (!user) throw new Error('user not found');

    sendResponse(res, { message: 'Successfully changed user role' });
  } catch (handleAddUserRoleError) {
    sendError({
      res,
      error: handleAddUserRoleError,
      code: statusCodes.SERVER_ERROR,
    });
  }
}

export async function handleUpdateUser(req: Request, res: Response) {
  try {
    const params = req.body;

    // don't allow updating password and role through here
    delete params.password;
    delete params.role;
    delete params.refreshToken;

    // Update the user if exists
    const user = await User.findByIdAndUpdate(req.user._id, params, {
      new: true,
      fields: { password: 0, refreshToken: 0 },
    });

    if (!user) throw new Error('User not found');

    sendResponse(res, user);
  } catch (err) {
    sendError({
      res,
      error: err,
      code: statusCodes.SERVER_ERROR,
    });
  }
}

export async function getUserProfile(req: Request, res: Response) {
  try {
    const userProfile = await User.findById(req.user._id).select({
      password: 0,
      refreshToken: 0,
    });
    if (!userProfile) throw new Error('user not found');

    sendResponse(res, userProfile);
  } catch (err) {
    sendError({
      res,
      error: err,
      code: statusCodes.SERVER_ERROR,
    });
  }
}

export async function handleGetAllUsers(req: Request, res: Response) {
  try {
    const { page } = req.query;
    const permission = ac.can(req.user.role).readAny('user');
    if (!permission.granted) throw new Error('can not access resource');

    const users = await User.paginate(
      {},
      { page, limit: 10, select: 'name email isDeleted' }
    );
    sendResponse(res, users);
  } catch (err) {
    sendError({
      res,
      error: err,
      code: statusCodes.SERVER_ERROR,
    });
  }
}

export async function handleDeleteUser(req: Request, res: Response) {
  try {
    const permission = ac.can(req.user.role).updateAny('user-status');
    if (!permission.granted) throw new Error('can not access resource');

    const { id } = req.params;
    await User.findByIdAndUpdate(id, { isDeleted: true, refreshToken: '' });
    sendResponse(res, { message: 'Successfully deleted a user' });
  } catch (err) {
    sendError({
      res,
      error: err,
      code: statusCodes.SERVER_ERROR,
    });
  }
}

export async function handleEnableUser(req: Request, res: Response) {
  try {
    const permission = ac.can(req.user.role).updateAny('user-status');
    if (!permission.granted) throw new Error('can not access resource');

    const { id } = req.params;
    await User.findByIdAndUpdate(id, { isDeleted: false });
    sendResponse(res, { message: 'Successfully enabled a user' });
  } catch (err) {
    sendError({
      res,
      error: err,
      code: statusCodes.SERVER_ERROR,
    });
  }
}
