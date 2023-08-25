import validator from 'validator';

export function validateCreateStatementDocument(data: any) {
  let isValid: boolean = false;
  const errors: any = {};

  if (Object.keys(errors).length === 0) {
    isValid = true;
  }

  return { errors, isValid };
}
