import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
      // Still stored even if submitted anonymously, so we know who voted/who to notify on reply —
      // 'isAnonymous' just controls whether the name is ever shown to the mess manager/admin.
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      required: [true, 'Complaint description is required'],
      trim: true,
    },
    photoUrl: {
      type: String,
      trim: true,
    },
    mealType: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    category: {
      type: String,
      enum: ['taste', 'hygiene', 'quantity', 'variety', 'service', 'uncategorized'],
      default: 'uncategorized', // filled in by AI analysis once we add that step
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'resolved'],
      default: 'pending',
    },
    messManagerReply: {
      type: String,
      trim: true,
    },
    votes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
  },
  { timestamps: true }
);

const complaintModel = mongoose.models.complaint || mongoose.model('complaint', complaintSchema);
export default complaintModel;