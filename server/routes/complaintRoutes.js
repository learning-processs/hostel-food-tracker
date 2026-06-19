import express from 'express';

import { submitComplaint, getAllComplaints, getMyComplaints, replyToComplaint , voteComplaint} from '../controllers/complaintController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const complaintRouter = express.Router();


complaintRouter.post('/', protect, submitComplaint);
complaintRouter.get('/me', protect, getMyComplaints);
complaintRouter.put('/:id/vote', protect, voteComplaint);
complaintRouter.get('/', protect, authorize('mess_manager', 'admin'), getAllComplaints);
complaintRouter.put('/:id/reply', protect, authorize('mess_manager'), replyToComplaint);

export default complaintRouter;