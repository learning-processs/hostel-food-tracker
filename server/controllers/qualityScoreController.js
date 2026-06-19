import ratingModel from "../models/ratingModel.js";
import complaintModel from "../models/complaintModel.js";


// @route   GET /api/quality-score/:date   (format: YYYY-MM-DD)
// @access  Private (mess_manager, admin)
export const getDailyQualityScore = async (req, res, next) => {
  try {
    const requestedDate = new Date(req.params.date);
    if (isNaN(requestedDate)) {
      res.status(400);
      throw new Error('Invalid date format. Use YYYY-MM-DD');
    }
    requestedDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(requestedDate);
    nextDay.setDate(nextDay.getDate() + 1);

    // 1. Average rating per meal for the day
    const ratingSummary = await ratingModel.aggregate([
      { $match: { date: { $gte: requestedDate, $lt: nextDay } } },
      {
        $group: {
          _id: '$mealType',
          averageStars: { $avg: '$stars' },
          totalRatings: { $sum: 1 },
        },
      },
    ]);

    // Overall average across all meals that day
    const allStars = ratingSummary.flatMap((m) => Array(m.totalRatings).fill(m.averageStars));
    const overallAverageStars =
      ratingSummary.length > 0
        ? ratingSummary.reduce((sum, m) => sum + m.averageStars * m.totalRatings, 0) /
          ratingSummary.reduce((sum, m) => sum + m.totalRatings, 0)
        : 0;

    // 2. Complaint count + resolution rate for the day
    const complaints = await complaintModel.find({ date: { $gte: requestedDate, $lt: nextDay } });
    const complaintCount = complaints.length;
    const resolvedCount = complaints.filter((c) => c.status === 'resolved').length;
    const resolutionRate = complaintCount > 0 ? (resolvedCount / complaintCount) * 100 : 100;

    // 3. Compute the score (0-100)
    // - Base: average star rating converted to a 100-point scale
    // - Penalty: each complaint knocks off points (capped so one bad day can't go negative)
    // - Bonus: resolving complaints quickly earns some points back
    const ratingComponent = (overallAverageStars / 5) * 100;
    const complaintPenalty = Math.min(complaintCount * 5, 50);
    const resolutionBonus = (resolutionRate / 100) * 10;

    let qualityScore = ratingComponent - complaintPenalty + resolutionBonus;
    qualityScore = Math.max(0, Math.min(100, qualityScore));

    res.json({
      date: requestedDate,
      meals: ratingSummary,
      overallAverageStars: Number(overallAverageStars.toFixed(2)),
      complaintCount,
      resolvedCount,
      resolutionRate: Number(resolutionRate.toFixed(1)),
      qualityScore: Number(qualityScore.toFixed(1)),
    });
  } catch (error) {
    next(error);
  }
};