import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { validateSignUp } from '../../validators/signUpValidations';
import { sendError, sendResponse } from '../../responseHandler';
import User, { ROLES } from '../../models/User';

export async function handleCreateAdmin(req: Request, res: Response) {
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
      return sendError({ res, error: validationError, code: 400 });
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
    sendError({ res, error: signUpError, code: 500 });
  }
}
