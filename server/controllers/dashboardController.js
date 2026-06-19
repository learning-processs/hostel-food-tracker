import userModel from "../models/userModel.js";
import complaintModel from "../models/complaintModel.js";
import ratingModel from "../models/ratingModel.js";


// @route   GET /api/dashboard
// @access  Private (admin)
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalStudents = await userModel.countDocuments({ role: 'student' });
    const totalMessManagers = await userModel.countDocuments({ role: 'mess_manager' });

    const totalComplaints = await complaintModel.countDocuments();
    const pendingComplaints = await complaintModel.countDocuments({ status: 'pending' });
    const resolvedComplaints = await complaintModel.countDocuments({ status: 'resolved' });

    // Complaint breakdown by category (taste, hygiene, quantity, variety, service)
    const categoryBreakdown = await complaintModel.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Overall average rating across all time
    const overallRating = await ratingModel.aggregate([
      { $group: { _id: null, averageStars: { $avg: '$stars' }, totalRatings: { $sum: 1 } } },
    ]);

    res.json({
      totalStudents,
      totalMessManagers,
      totalComplaints,
      pendingComplaints,
      resolvedComplaints,
      resolutionRate:
        totalComplaints > 0 ? Number(((resolvedComplaints / totalComplaints) * 100).toFixed(1)) : 0,
      categoryBreakdown,
      overallAverageRating: overallRating[0] ? Number(overallRating[0].averageStars.toFixed(2)) : 0,
      totalRatingsSubmitted: overallRating[0] ? overallRating[0].totalRatings : 0,
    });
  } catch (error) {
    next(error);
  }
};