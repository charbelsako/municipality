import { Response } from 'express';

export async function sendError(
  res: Response,
  error: any,
  code: number,
  errorLabel?: string
) {
  res.status(code).send(error);
}

export async function sendResponse(res: Response, data: any) {
  const returnData = {
    success: true,
    data: data,
  };
  res.send(returnData);
}
