import express, { Request, Response } from 'express';
import { verifyJWT } from '../../middleware/verifyJWT';
import {
  handleAddStatementDocument,
  handleDocumentMarkAsDone,
  handleDocumentMarkAsRejected,
  getDocumentDetail,
  handleProcessDocuments,
  getMyRequests,
  getAllDocuments,
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
 * @route /api/v1/documents/:id/mark-as-done
 * @param id the id of the document to mark as done
 * @desc sets a document as done
 * @access private Admins only
 * @method PATCH
 */
router.patch('/:id/mark-as-done', verifyJWT, handleDocumentMarkAsDone);

/**
 * @route /api/v1/documents/:id/mark-as-rejected
 * @param id the id of the document to reject
 * @desc sets a document as rejected
 * @access private Admins only
 * @method PATCH
 */
router.patch('/:id/mark-as-rejected', verifyJWT, handleDocumentMarkAsRejected);

/**
 * @route /api/v1/documents/all
 * @desc Retrieves all documents for all users
 * @param page number
 * @access private Admin
 * @method GET
 */
router.get('/all', verifyJWT, getAllDocuments);

/**
 * @route /api/v1/documents/my
 * @desc Retrieves all documents for the current user
 * @access private Signed in users
 * @method GET
 */
router.get('/my', verifyJWT, getMyRequests);

/**
 * @route /api/v1/documents/:id
 * @desc Retrieves document details
 * @access private Signed in Citizen's can view their own documents, Admins can view any
 * @method GET
 */
router.get('/:id', verifyJWT, getDocumentDetail);

/**
 * @route /api/v1/documents/:id/process
 * @desc processes documents (for now only statement documents)
 * @access Admins only
 * @method POST
 */
router.post('/:id/process', verifyJWT, handleProcessDocuments);

export default router;
