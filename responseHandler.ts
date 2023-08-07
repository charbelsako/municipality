import { Response } from 'express';

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
  res.status(code).send(error);
}

export async function sendResponse(res: Response, data: any) {
  const returnData = {
    success: true,
    data: data,
  };
  res.send(returnData);
}

export async function sendStatus(res: Response, code: number) {
  res.sendStatus(code);
}
