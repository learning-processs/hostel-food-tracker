import ratingModel from "../models/ratingModel.js";
import menuModel from "../models/menuModel.js";



// @route   GET /api/leaderboard/meals?month=6&year=2026
// @access  Private (mess_manager, admin)
export const getBestWorstMeals = async (req, res, next) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      res.status(400);
      throw new Error('month and year query params are required, e.g. ?month=6&year=2026');
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1); // first day of the next month

    const ranked = await ratingModel.aggregate([
      { $match: { date: { $gte: startDate, $lt: endDate } } },
      {
        $group: {
          _id: { date: '$date', mealType: '$mealType' },
          averageStars: { $avg: '$stars' },
          totalRatings: { $sum: 1 },
        },
      },
      { $sort: { averageStars: -1 } },
    ]);

    // Attach the actual menu items for context (e.g. "Lunch on the 17th: Rice, Dal, Paneer Curry")
    const withItems = await Promise.all(
      ranked.map(async (entry) => {
        const menu = await menuModel.findOne({ date: entry._id.date });
        const items = menu ? menu[entry._id.mealType]?.items || [] : [];
        return {
          date: entry._id.date,
          mealType: entry._id.mealType,
          averageStars: Number(entry.averageStars.toFixed(2)),
          totalRatings: entry.totalRatings,
          items,
        };
      })
    );

    res.json({
      bestMeals: withItems.slice(0, 5),
      worstMeals: withItems.slice(-5).reverse(),
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/leaderboard/trend?month=6&year=2026
// @access  Private (mess_manager, admin)
export const getMonthlyTrend = async (req, res, next) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      res.status(400);
      throw new Error('month and year query params are required, e.g. ?month=6&year=2026');
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const trend = await ratingModel.aggregate([
      { $match: { date: { $gte: startDate, $lt: endDate } } },
      {
        $group: {
          _id: '$date',
          averageStars: { $avg: '$stars' },
          totalRatings: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(
      trend.map((t) => ({
        date: t._id,
        averageStars: Number(t.averageStars.toFixed(2)),
        totalRatings: t.totalRatings,
      }))
    );
  } catch (error) {
    next(error);
  }
};