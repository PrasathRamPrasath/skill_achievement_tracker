import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    date: {
      type: Date,
      required: [true, 'Please add a date'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      trim: true,
    },
    level: {
      type: String,
      enum: ['local', 'regional', 'national', 'international'],
      default: 'local',
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

export default mongoose.model('Achievement', achievementSchema);
