import { config } from 'dotenv';
config();
import mongoose from 'mongoose';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors, { CorsOptions } from 'cors';
import corsOptions from './config/corsOptions';
// routes
import authRouter from './routes/auth/authRouter';
import userRouter from './routes/user/userRouter';
import documentRouter from './routes/documentRequest/documentRequestRouter';
import credentials from './middleware/credentials';

const app = express();

app.use(credentials);
app.use(cors(<CorsOptions>corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/documents', documentRouter);
app.get('/', (req, res) => res.send('working'));

// connect to database
const uri = process.env.MONGO_URI as string;
mongoose.connect(uri);
console.log('Connected to the database');

export default app;
