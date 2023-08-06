import { config } from 'dotenv-flow';
config();
import mongoose from 'mongoose';
import express from 'express';
import authRouter from './routes/authRouter';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/auth', authRouter);
// console.log(process.env.MONGO_URI);

// connect to database
const uri: string = process.env.MONGO_URI as string;
mongoose.connect(uri);

app.get('/', (req, res) => res.send('working'));

app.listen(3000, () => console.log('Listening on Port 3000'));
