import attendanceModel from '../models/attendanceModel.js';
import menuModel from '../models/menuModel.js';

// @route   POST /api/attendance
// @access  Private (student)
export const markAttendance = async (req, res, next) => {
  try {
    const { date, mealType, isAttending } = req.body;

    if (!date || !mealType) {
      res.status(400);
      throw new Error('Date and mealType are required');
    }

    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    const attendance = await attendanceModel.findOneAndUpdate(
      { student: req.user._id, date: normalizedDate, mealType },
      { student: req.user._id, date: normalizedDate, mealType, isAttending: isAttending !== false },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json(attendance);
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/attendance/wastage/:date   (format: YYYY-MM-DD)
// @access  Private (mess_manager, admin)
export const getWastageReport = async (req, res, next) => {
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

    const mealTypes = ['breakfast', 'lunch', 'dinner'];

    const report = await Promise.all(
      mealTypes.map(async (mealType) => {
        const attendingCount = await attendanceModel.countDocuments({
          date: requestedDate,
          mealType,
          isAttending: true,
        });

        const preparedQuantity = menu[mealType]?.preparedQuantity || 0;
        const estimatedWastage = Math.max(0, preparedQuantity - attendingCount);
        const wastagePercentage =
          preparedQuantity > 0 ? Number(((estimatedWastage / preparedQuantity) * 100).toFixed(1)) : 0;

        return {
          mealType,
          preparedQuantity,
          attendingCount,
          estimatedWastage,
          wastagePercentage,
        };
      })
    );

    res.json({ date: requestedDate, report });
  } catch (error) {
    next(error);
  }
};