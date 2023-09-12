import validator from 'validator';
import { IUser } from '../models/User';

export function validateCreateCitizen(data: any) {
  let isValid: boolean = false;
  const errors: any = {};
  data.email = data?.email || '';
  data.password = data?.password || '';
  data.firstName = data?.firstName || '';
  data.lastName = data?.lastName || '';
  data.motherName = data?.motherName || '';
  data.dateOfBirth = data?.dateOfBirth || '';
  data.recordNumber = data?.recordNumber || '';
  data.recordSect = data?.recordSect || '';
  data.personalSect = data?.personalSect || '';

  if (validator.isEmpty(data.email)) {
    errors.email = 'Email is empty';
  }
  if (!validator.isStrongPassword(data.password)) {
    errors.password =
      'Password must include, 8 characters, 1 number, 1 uppercase, 1 symbol';
  }
  if (validator.isEmpty(data.firstName)) {
    errors.firstName = 'first name is empty';
  }
  if (validator.isEmpty(data.lastName)) {
    errors.lastName = 'last name is empty';
  }
  if (validator.isEmpty(data.motherName)) {
    errors.motherName = 'mother name is empty';
  }
  if (validator.isEmpty(data.dateOfBirth)) {
    errors.dateOfBirth = 'date of birth is empty';
  }
  if (validator.isEmpty(data.recordNumber)) {
    errors.recordNumber = 'record number is empty';
  }
  if (validator.isEmpty(data.recordSect)) {
    errors.recordSect = 'record sect is empty';
  }
  if (validator.isEmpty(data.personalSect)) {
    errors.personalSect = 'personal Sect is empty';
  }
  if (validator.isEmpty(data.sex)) {
    errors.sex = 'Sex is empty';
  }

  if (Object.keys(errors).length === 0) {
    isValid = true;
  }

  return { errors, isValid };
}
