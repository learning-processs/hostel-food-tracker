import express from 'express';

import { submitRating , getMyRatings, getRatingsSummary} from '../controllers/ratingController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const ratingRouter = express.Router();


ratingRouter.post('/', protect, submitRating);
ratingRouter.get('/me', protect, getMyRatings);
ratingRouter.get('/summary/:date', protect, authorize('mess_manager', 'admin'), getRatingsSummary);

export default ratingRouter;