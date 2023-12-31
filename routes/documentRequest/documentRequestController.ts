import { Request, Response } from 'express';
import { sendError, sendResponse } from '../../responseHandler';
import { statusCodes } from '../../constants';
import {
  DOCUMENT_TYPES,
  DocumentRequest,
  DocumentStatus,
} from '../../models/DocumentRequest';
import ac from '../../accesscontrol/setup';

export async function handleAddStatementDocument(req: Request, res: Response) {
  try {
    const {
      address,
      phoneNumber,
      propertyNo,
      sectionNo,
      realEstateArea,
      requestFor,
      attachedDocuments,
      notes,
    } = req.body;

    const document = new DocumentRequest({
      callee: req.user._id,
      type: DOCUMENT_TYPES.STATEMENT,
      address,
      phoneNumber,
      propertyNo,
      sectionNo,
      realEstateArea,
      requestFor,
      attachedDocuments,
      notes,
    });

    await document.save();

    sendResponse(res, document);
  } catch (handleAddStatementDocumentError) {
    sendError({
      res,
      error: handleAddStatementDocumentError,
      code: statusCodes.SERVER_ERROR,
    });
  }
}

export async function getAllDocuments(req: Request, res: Response) {
  try {
    const permission = ac.can(req.user.role).readAny('document');

    if (!permission.granted) {
      throw new Error('You do not have permission to access this resource');
    }

    const { page } = req.query;

    const documents = await DocumentRequest.paginate(
      {},
      { page, limit: 10, sort: { _id: -1 } }
    );

    sendResponse(res, documents);
  } catch (getAllDocumentsError) {
    sendError({
      res,
      error: getAllDocumentsError,
      code: statusCodes.SERVER_ERROR,
    });
  }
}

export async function handleDocumentMarkAsDone(req: Request, res: Response) {
  try {
    const permission = ac.can(req.user.role).updateAny('document-status');
    if (!permission) {
      throw new Error('You do not have permission to access this resource');
    }

    const { id } = req.body;
    const document = await DocumentRequest.findByIdAndUpdate(id);

    if (!document) throw new Error('document not found');

    if (document.status !== DocumentStatus.SUBMITTED) {
      throw new Error(
        `Cannot mark as done, status ${document.status}, should be ${DocumentStatus.SUBMITTED}`
      );
    }

    document.status = DocumentStatus.DONE;
    await document.save();

    sendResponse(res, document);
  } catch (err) {
    sendError({ res, error: err, code: statusCodes.SERVER_ERROR });
  }
}

export async function handleDocumentMarkAsRejected(
  req: Request,
  res: Response
) {
  try {
    const permission = ac.can(req.user.role).updateAny('document-status');
    if (!permission) {
      throw new Error('You do not have permission to access this resource');
    }

    const { id } = req.body;
    const document = await DocumentRequest.findById(id);

    if (!document) throw new Error('document not found');

    document.status = DocumentStatus.REJECTED;
    await document.save();

    sendResponse(res, document);
  } catch (err) {
    sendError({ res, error: err, code: statusCodes.SERVER_ERROR });
  }
}

export async function handleProcessDocuments(req: Request, res: Response) {
  try {
    const permission = ac.can(req.user.role).updateAny('document-process');
    if (!permission) {
      throw new Error('You do not have permission to access this resource');
    }

    const { id } = req.params;
    const { idNumber, submittedAt } = req.body;
    const document = await DocumentRequest.findByIdAndUpdate(
      id,
      {
        idNumber,
        submittedAt,
        status: DocumentStatus.SUBMITTED,
      },
      { new: true }
    );

    if (!document) throw new Error('Document not found');

    sendResponse(res, document);
  } catch (err) {
    sendError({
      res,
      error: err,
      code: statusCodes.SERVER_ERROR,
    });
  }
}

export async function getMyRequests(req: Request, res: Response) {
  try {
    const { page } = req.query;
    const requests = await DocumentRequest.paginate(
      { callee: req.user._id },
      { page }
    );

    sendResponse(res, requests);
  } catch (getMyRequestsError) {
    sendError({
      res,
      error: getMyRequestsError,
      code: statusCodes.SERVER_ERROR,
    });
  }
}

export async function getDocumentDetail(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const permission = ac.can(req.user.role).readAny('document');

    let document;
    if (permission.granted) {
      document = await DocumentRequest.findById(id).populate('callee', 'name');
    } else {
      document = await DocumentRequest.findOne({
        _id: id,
        callee: req.user._id,
      }).populate('callee', 'name');
    }

    if (!document) {
      throw new Error('Document not found');
    }

    sendResponse(res, document);
  } catch (getDocumentDetailError) {
    sendError({
      res,
      error: getDocumentDetailError,
      code: statusCodes.SERVER_ERROR,
    });
  }
}
