import bcrypt from 'bcryptjs';
import userModel from '../models/userModel.js';
import sendEmail from '../utils/sendEmail.js';

// @route   POST /api/admin/users
// @access  Private (admin)
export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, hostelBlock, roomNumber, assignedMess, phone } = req.body;

    if (!name || !email || !password || !role) {
      res.status(400);
      throw new Error('Name, email, password, and role are required');
    }

    const validRoles = ['student', 'mess_manager', 'admin'];
    if (!validRoles.includes(role)) {
      res.status(400);
      throw new Error('Invalid role');
    }

    const userExists = await userModel.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('An account with this email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      role,
      hostelBlock,
      roomNumber,
      assignedMess,
      phone,
    });

    // Send the new user their login credentials by email
    sendEmail({
      to: user.email,
      subject: 'Welcome to Hostel Food Quality Tracker',
      html: `
        <p>Hi ${user.name},</p>
        <p>An account has been created for you as a <strong>${user.role.replace('_', ' ')}</strong>.</p>
        <p>Your login details:</p>
        <p>Email: ${user.email}<br/>Temporary Password: ${password}</p>
        <p>Please log in and consider this your starting password.</p>
      `,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/admin/users?role=student
// @access  Private (admin)
export const getAllUsers = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.role) filter.role = req.query.role;

    const users = await userModel.find(filter).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/admin/users/:id/status
// @access  Private (admin)
export const updateUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;

    const user = await userModel.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    user.isActive = isActive;
    await user.save();

    res.json({ _id: user._id, name: user.name, isActive: user.isActive });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/admin/users/:id
// @access  Private (admin)
export const deleteUser = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};