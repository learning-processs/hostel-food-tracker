import express from 'express';
import { markAttendance , getWastageReport } from '../controllers/attendanceController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const attendanceRouter = express.Router();

attendanceRouter.post('/', protect, markAttendance);
attendanceRouter.get('/wastage/:date', protect, authorize('mess_manager', 'admin'), getWastageReport);

export default attendanceRouter;