import validator from 'validator';
import { IUser } from '../models/User';

export function validateSignUp(data: IUser) {
  let isValid: boolean = false;
  const errors: any = {};
  data.username = data.username || '';
  data.password = data.password || '';
  data.name.firstName = data.name.firstName || '';
  data.name.lastName = data.name.lastName || '';
  data.idNumber = data.idNumber || '';

  if (validator.isEmpty(data.username)) {
    errors.username = 'Username is empty';
  }
  if (!validator.isStrongPassword(data.password)) {
    console.log('what');
    errors.password =
      'Password must include, 8 characters, 1 number, 1 uppercase, 1 symbol';
  }
  if (validator.isEmpty(data.idNumber)) {
    errors.idNumber = 'id number is empty';
  }
  if (validator.isEmpty(data.name.firstName)) {
    errors.name.firstName = 'first name is empty';
  }
  if (validator.isEmpty(data.name.lastName)) {
    errors.name.lastName = 'last name is empty';
  }
  if (Object.keys(errors).length === 0) {
    isValid = true;
  }

  return { errors, isValid };
}