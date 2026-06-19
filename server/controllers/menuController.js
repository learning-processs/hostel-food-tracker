import menuModel from '../models/menuModel.js';
import userModel from '../models/userModel.js';
import sendEmail from '../utils/sendEmail.js';
// @route   POST /api/menu
// @access  Private (mess_manager)
export const createOrUpdateMenu = async (req, res, next) => {
  try {
    const { date, breakfast, lunch, dinner } = req.body;

    if (!date) {
      res.status(400);
      throw new Error('Date is required');
    }

    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    const menu = await menuModel.findOneAndUpdate(
      { date: normalizedDate },
      {
        date: normalizedDate,
        breakfast,
        lunch,
        dinner,
        updatedBy: req.user._id,
      },
      { new: true, upsert: true, runValidators: true }
    );

    // Notify all active students that the menu is up
    const students = await userModel.find({ role: 'student', isActive: true }).select('email name');
    students.forEach((student) => {
      sendEmail({
        to: student.email,
        subject: `Menu updated for ${normalizedDate.toDateString()}`,
        html: `
          <p>Hi ${student.name},</p>
          <p>The mess menu for <strong>${normalizedDate.toDateString()}</strong> has been updated.</p>
          <p>Breakfast: ${breakfast?.items?.join(', ') || 'Not set'}</p>
          <p>Lunch: ${lunch?.items?.join(', ') || 'Not set'}</p>
          <p>Dinner: ${dinner?.items?.join(', ') || 'Not set'}</p>
        `,
      });
    });

    res.status(200).json(menu);
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/menu/today
// @access  Private (student)
export const getTodayMenu = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const menu = await menuModel.findOne({ date: today });

    if (!menu) {
      res.status(404);
      throw new Error("Today's menu hasn't been set yet");
    }

    res.json(menu);
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/menu/:date   (format: YYYY-MM-DD)
// @access  Private
export const getMenuByDate = async (req, res, next) => {
  try {
    const requestedDate = new Date(req.params.date);

    if (isNaN(requestedDate)) {
      res.status(400);
      throw new Error('Invalid date format. Use YYYY-MM-DD');
    }
    requestedDate.setHours(0, 0, 0, 0);

    const menu = await menuModel.findOne({ date: requestedDate });

    if (!menu) {
      res.status(404);
      throw new Error('No menu found for this date');
    }

    res.json(menu);
  } catch (error) {
    next(error);
  }
};