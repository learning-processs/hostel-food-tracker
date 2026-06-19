import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema(
  {
    items: {
      type: [String],
      default: [],
    },
    time: {
      type: String,
      trim: true,
    },
    preparedQuantity: {
      type: Number, // number of plates/servings prepared, set by the mess manager
      default: 0,
    },
  },
  { _id: false }
);

const menuSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: [true, 'Date is required'],
      unique: true, // one menu document per day
    },
    breakfast: mealSchema,
    lunch: mealSchema,
    dinner: mealSchema,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
  },
  { timestamps: true }
);

const menuModel = mongoose.models.menu || mongoose.model('menu', menuSchema);
export default menuModel;