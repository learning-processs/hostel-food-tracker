import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    mealType: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner'],
      required: [true, 'Meal type is required'],
    },
    stars: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Star rating is required'],
    },
  },
  { timestamps: true }
);

// One rating per student, per meal, per day — submitting again updates it instead of duplicating
ratingSchema.index({ student: 1, date: 1, mealType: 1 }, { unique: true });

const ratingModel = mongoose.models.rating || mongoose.model('rating', ratingSchema);
export default ratingModel;