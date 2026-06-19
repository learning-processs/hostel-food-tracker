import express from 'express';
import { createOrUpdateMenu , getMenuByDate, getTodayMenu} from '../controllers/menuController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const menuRouter = express.Router();

menuRouter.post('/', protect, authorize('mess_manager'), createOrUpdateMenu);
menuRouter.get('/today',protect, getTodayMenu);
menuRouter.get('/:date',protect , getMenuByDate);

export default menuRouter;

