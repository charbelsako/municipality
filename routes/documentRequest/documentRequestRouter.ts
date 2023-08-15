import express, { Request, Response } from 'express';
import { verifyJWT } from '../../middleware/verifyJWT';
import {
  handleAddStatementDocument,
  handleDocumentMarkAsDone,
  handleViewStatementDocuments,
} from './documentRequestController';

const router = express.Router();

/**
 * @route /api/v1/documents/statement-document/create
 * @desc Retrieves all statement documents
 * @access private Citizen
 * @method GET
 */
router.post(
  '/statement-document/create',
  verifyJWT,
  handleAddStatementDocument
);

/**
 * @route /api/v1/documents/view-statement-documents
 * @desc Retrieves all statement documents
 * @access private Admin
 * @method GET
 */
router.get(
  '/view-statement-documents',
  verifyJWT,
  handleViewStatementDocuments
);

router.patch(
  '/statement-document/:id/mark-as-done',
  verifyJWT,
  handleDocumentMarkAsDone
);

export default router;
