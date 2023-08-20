import express, { Request, Response } from 'express';
import { verifyJWT } from '../../middleware/verifyJWT';
import {
  getAllRequests,
  handleAddStatementDocument,
  handleDocumentMarkAsDone,
  handleViewStatementDocuments,
  handleDocumentMarkAsRejected,
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

router.patch('/:id/mark-as-rejected', verifyJWT, handleDocumentMarkAsRejected);

/**
 * @route /api/v1/documents/my
 * @desc Retrieves all documents for the current user
 * @access private Signed in users
 * @method GET
 */
router.get('/my', verifyJWT, getAllRequests);

export default router;
