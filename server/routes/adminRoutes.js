import express from 'express';
import { createUser, getAllUsers, updateUserStatus, deleteUser } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const adminRouter = express.Router();

// Every route here requires a logged-in admin
adminRouter.use(protect, authorize('admin'));

adminRouter.post('/users', createUser);
adminRouter.get('/users', getAllUsers);
adminRouter.put('/users/:id/status', updateUserStatus);
adminRouter.delete('/users/:id', deleteUser);

export default adminRouter;