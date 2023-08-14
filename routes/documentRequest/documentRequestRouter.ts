import express, { Request, Response } from 'express';
import { verifyJWT } from '../../middleware/verifyJWT';
import { handleAddStatementDocument } from './documentRequestController';

const router = express.Router();

router.post('/statement-document', verifyJWT, handleAddStatementDocument);
