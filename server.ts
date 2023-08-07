import { config } from 'dotenv-flow';
config();
import mongoose from 'mongoose';
import express from 'express';
import authRouter from './routes/authRouter';
import path from 'path';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/auth', authRouter);

// connect to database
const uri = process.env.MONGO_URI as string;
mongoose.connect(uri);
console.log('Connect to the database');

// For React.js build
// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  console.log('production mode');
  app.use(express.static('frontend/.next/'));
  // console.log(path.resolve(__dirname, "client/", "build/", "index.html"))
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client/', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 3000;

app.listen(3000, () => console.log('Listening on Port 3000'));
