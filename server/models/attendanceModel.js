import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
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
    isAttending: {
      type: Boolean,
      default: true, // assume attending unless the student says otherwise
    },
  },
  { timestamps: true }
);

// One attendance record per student, per meal, per day
attendanceSchema.index({ student: 1, date: 1, mealType: 1 }, { unique: true });

const attendanceModel = mongoose.models.attendance || mongoose.model('attendance', attendanceSchema);
export default attendanceModel;