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
 * @access private Admins only
 * @method GET
 */
router.get(
  '/view-statement-documents',
  verifyJWT,
  handleViewStatementDocuments
);

/**
 * @route /api/v1/documents/:id/mark-as-done
 * @param id the id of the document to mark as done
 * @desc sets a document as done
 * @access private Admins only
 * @method PATCH
 */
router.patch(
  '/statement-document/:id/mark-as-done',
  verifyJWT,
  handleDocumentMarkAsDone
);

/**
 * @route /api/v1/documents/:id/mark-as-rejected
 * @param id the id of the document to reject
 * @desc sets a document as rejected
 * @access private Admins only
 * @method PATCH
 */
router.patch('/:id/mark-as-rejected', verifyJWT, handleDocumentMarkAsRejected);

/**
 * @route /api/v1/documents/my
 * @desc Retrieves all documents for the current user
 * @access private Signed in users
 * @method GET
 */
router.get('/my', verifyJWT, getAllRequests);

export default router;
