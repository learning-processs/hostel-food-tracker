import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const dashboardRouter = express.Router();

dashboardRouter.get('/', protect, authorize('admin'), getDashboardStats);

export default dashboardRouter;