import mongoose from 'mongoose';

const certificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Please provide certification name'],
    trim: true,
  },
  issuer: {
    type: String,
    required: [true, 'Please provide issuer'],
    trim: true,
  },
  date: {
    type: Date,
    required: [true, 'Please provide certification date'],
  },
  certificateUrl: {
    type: String,
    trim: true,
  },
  imageUrl: {
    type: String,
  },
  skills: [{
    type: String,
    trim: true,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Certification = mongoose.model('Certification', certificationSchema);

export default Certification;
