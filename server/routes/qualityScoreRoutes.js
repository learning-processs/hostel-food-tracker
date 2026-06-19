import express from 'express';
import { getDailyQualityScore } from '../controllers/qualityScoreController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const qualityScoreRouter = express.Router();

qualityScoreRouter.get('/:date', protect, authorize('mess_manager', 'admin'), getDailyQualityScore);

export default qualityScoreRouter;