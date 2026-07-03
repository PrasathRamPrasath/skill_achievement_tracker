import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add an activity name'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Please add a type'],
      trim: true,
    },
    role: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Please add a date'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Activity', activitySchema);
