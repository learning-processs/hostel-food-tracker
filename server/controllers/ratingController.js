import ratingModel from "../models/ratingModel.js";


// @route   POST /api/ratings
// @access  Private (student)
export const submitRating = async (req, res, next) => {
  try {
    const { date, mealType, stars } = req.body;

    if (!date || !mealType || !stars) {
      res.status(400);
      throw new Error('Date, mealType, and stars are required');
    }

    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    const rating = await ratingModel.findOneAndUpdate(
      { student: req.user._id, date: normalizedDate, mealType },
      { student: req.user._id, date: normalizedDate, mealType, stars },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json(rating);
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/ratings/me
// @access  Private (student)
export const getMyRatings = async (req, res, next) => {
  try {
    const ratings = await ratingModel.find({ student: req.user._id }).sort({ date: -1 });
    res.json(ratings);
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/ratings/summary/:date   (format: YYYY-MM-DD)
// @access  Private (mess_manager, admin)
export const getRatingsSummary = async (req, res, next) => {
  try {
    const requestedDate = new Date(req.params.date);
    if (isNaN(requestedDate)) {
      res.status(400);
      throw new Error('Invalid date format. Use YYYY-MM-DD');
    }
    requestedDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(requestedDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const summary = await ratingModel.aggregate([
      { $match: { date: { $gte: requestedDate, $lt: nextDay } } },
      {
        $group: {
          _id: '$mealType',
          averageStars: { $avg: '$stars' },
          totalRatings: { $sum: 1 },
        },
      },
    ]);

    res.json(summary);
  } catch (error) {
    next(error);
  }
};