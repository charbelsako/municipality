import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { validateSignUp } from '../../validators/signUpValidations';
import { sendError, sendResponse } from '../../responseHandler';
import User, { ROLES } from '../../models/User';
import { validateCreateCitizen } from '../../validators/createCitizenValidator';
import { statusCodes } from '../../constants';
import ac from '../../accesscontrol/setup';

export async function handleCreateAdmin(req: Request, res: Response) {
  try {
    const permission = ac.can(req.user.role).createAny('admin');

    if (!permission.granted) throw new Error('Cannot access this route');
    const {
      password,
      phoneNumbers,
      name,
      role,
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
      role: [ROLES.ADMIN],
    };

    const validationError = validateSignUp(data);

    if (!validationError.isValid) {
      return sendError({
        res,
        error: validationError,
        code: statusCodes.BAD_REQUEST,
      });
    }

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
    const permission = ac.can(req.user.role).createAny('citizen');
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
      role: [ROLES.CITIZEN],
    };

    const validationError = validateCreateCitizen(data);

    if (!validationError.isValid) {
      return sendError({
        res,
        error: validationError,
        code: statusCodes.BAD_REQUEST,
      });
    }

    // encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = new User({ ...data, password: hashedPassword });
    await userData.save();

    sendResponse(res, userData);
  } catch (handleCreateCitizenErr) {
    sendError({
      res,
      error: handleCreateCitizenErr,
      code: statusCodes.SERVER_ERROR,
    });
  }
}

export async function handleUpdatePassword(req: Request, res: Response) {
  try {
    const { newPassword } = req.body;
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

export async function handleChangeUserRole(req: Request, res: Response) {
  try {
    const permission = ac.can(req.user.role).updateAny('citizen');
    if (!permission.granted) throw new Error('can not access resource');

    const { id, role } = req.body;

    const user = await User.findByIdAndUpdate(id, { role });
    sendResponse(res, user);
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
