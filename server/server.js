import express from 'express';
// import dotenv from 'dotenv';
// dotenv.config();
import 'dotenv/config';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import connectDB from './config/db.js';
import authRouter from './routes/authRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import userModel from './models/userModel.js';
import menuRouter from './routes/menuRoutes.js';
import ratingRouter from './routes/ratingRoutes.js';
import complaintRouter from './routes/complaintRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import qualityScoreRouter from './routes/qualityScoreRoutes.js';
import leaderboardRouter from './routes/leaderboardRoutes.js';
import dashboardRouter from './routes/dashboardRoutes.js';
import attendanceRouter from './routes/attendanceRoutes.js';

const app = express();
const port = process.env.PORT  || 3000;


const seedAdmin = async () => {
  try {
    const adminExists = await userModel.findOne({ email: process.env.ADMIN_EMAIL });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);

      await userModel.create({
        name: 'Admin',
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        role: 'admin',
      });

    //   console.log(`Admin account created: ${process.env.ADMIN_EMAIL}`);
    }
  } catch (error) {
    console.error('Admin seeding error:', error.message);
  }
};

connectDB();
seedAdmin();

app.use(cors());
app.use(express.json());


app.use('/api/auth', authRouter);
app.use('/api/menu', menuRouter);
app.use('/api/ratings', ratingRouter);
app.use('/api/complaints', complaintRouter);
app.use('/api/admin', adminRouter);
app.use('/api/quality-score', qualityScoreRouter);
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/attendance', attendanceRouter);

app.use(notFound);
app.use(errorHandler);

app.get('/',(req, res)=>{
    res.send('Hostel Food Tracker API is online and functional...');
})

app.listen(port ,()=>console.log(`port is running on ${port}`));