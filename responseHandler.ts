import { Response } from 'express';
import { statusCodes } from './constants';

interface ErrorObject {
  res: Response;
  error?: any;
  code: number;
  errorLabel?: string;
}

export async function sendError({
  res,
  error = undefined,
  code,
  errorLabel,
}: ErrorObject) {
  if (!error) return res.sendStatus(code);

  if (code === statusCodes.BAD_REQUEST && error.message) {
    return res.status(code).send(error);
  }

  if (error.message) {
    return res
      .status(code)
      .send({ error: error.message || 'Something went wrong' });
  }
  res.status(code).send({ error: error });
}

export async function sendResponse(res: Response, data: any) {
  const returnData = {
    success: true,
    data: data,
  };
  res.status(statusCodes.OK).send(returnData);
}

export async function sendStatus(res: Response, code: number) {
  res.sendStatus(code);
}
