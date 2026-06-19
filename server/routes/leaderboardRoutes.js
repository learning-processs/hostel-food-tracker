import express from 'express';
import { getBestWorstMeals , getMonthlyTrend} from '../controllers/leaderboardController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const leaderboardRouter = express.Router();

leaderboardRouter.use(protect, authorize('mess_manager', 'admin'));

leaderboardRouter.get('/meals', getBestWorstMeals);
leaderboardRouter.get('/trend', getMonthlyTrend);

export default leaderboardRouter;