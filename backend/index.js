import  mongoose from 'mongoose';
import express from 'express';
import connectDB from './config/db.js';
import taskRoutes from "./routes/taskRoutes.js"
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/taskmanager';

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://studio-graphene-kappa.vercel.app"
    ],
    credentials: true,
  })
);

app.use(express.json());
connectDB();

app.use('/api/tasks', taskRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



