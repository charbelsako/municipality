import { Request, Response } from 'express';
import { sendError } from '../../responseHandler';
import { statusCodes } from '../../constants';
import { DocumentRequest } from '../../models/DocumentRequest';

export async function handleAddStatementDocument(req: Request, res: Response) {
  try {
    const document = new DocumentRequest({
      callee: req.user._id,
    });
  } catch (handleAddStatementDocumentError) {
    sendError({
      res,
      error: handleAddStatementDocumentError,
      code: statusCodes.SERVER_ERROR,
    });
  }
}
