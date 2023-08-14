import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { validateSignUp } from '../../validators/signUpValidations';
import { sendError, sendResponse } from '../../responseHandler';
import User, { ROLES } from '../../models/User';
import { validateCreateCitizen } from '../../validators/createCitizenValidator';
import { statusCodes } from '../../constants';

export async function handleCreateAdmin(req: Request, res: Response) {
  try {
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
      role: ROLES.ADMIN,
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