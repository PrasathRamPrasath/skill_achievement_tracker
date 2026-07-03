import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false,
  },
  // Student-specific fields
  rollNumber: {
    type: String,
    required: [true, 'Please provide a roll number'],
    unique: true,
    trim: true,
  },
  department: {
    type: String,
    required: [true, 'Please provide a department'],
    trim: true,
  },
  year: {
    type: Number,
    required: [true, 'Please provide your year'],
    min: 1,
    max: 4,
  },
  phone: {
    type: String,
    trim: true,
  },
  linkedin: {
    type: String,
    trim: true,
  },
  github: {
    type: String,
    trim: true,
  },
  skills: [{
    type: String,
    trim: true,
  }],
  resumeUrl: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
