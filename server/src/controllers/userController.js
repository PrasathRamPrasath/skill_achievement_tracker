import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import envConfig from '../config/envConfig.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, envConfig.jwtSecret, {
    expiresIn: envConfig.jwtExpire,
  });
};

// @desc    Register user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, rollNumber, department, year, phone, linkedin, github, adminSecret, designation } = req.body;
    console.log('Registering user with data:', req.body);

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // Admin registration path
    if (adminSecret) {
      if (adminSecret !== envConfig.adminSecret) {
        return res.status(403).json({ message: 'Invalid admin secret key' });
      }
      const admin = await User.create({ name, email, password, role: 'admin', designation });
      return res.status(201).json({
        _id: admin._id, name: admin.name, email: admin.email,
        role: admin.role, designation: admin.designation, token: generateToken(admin._id),
      });
    }

    // Student registration path
    if (!rollNumber) return res.status(400).json({ message: 'Roll number is required' });
    if (!department)  return res.status(400).json({ message: 'Department is required' });
    if (!year)        return res.status(400).json({ message: 'Year is required' });

    const user = await User.create({ name, email, password, rollNumber, department, year, phone, linkedin, github, role: 'student' });

    res.status(201).json({
      _id: user._id, name: user.name, email: user.email,
      rollNumber: user.rollNumber, department: user.department,
      year: user.year, phone: user.phone, linkedin: user.linkedin,
      github: user.github, skills: user.skills,
      careerGoal: user.careerGoal, role: user.role,
      resumeUrl: user.resumeUrl, token: generateToken(user._id),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      rollNumber: user.rollNumber,
      department: user.department,
      year: user.year,
      phone: user.phone,
      linkedin: user.linkedin,
      github: user.github,
      skills: user.skills,
      careerGoal: user.careerGoal,
      role: user.role,
      designation: user.designation,
      resumeUrl: user.resumeUrl,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      rollNumber: user.rollNumber,
      department: user.department,
      year: user.year,
      phone: user.phone,
      linkedin: user.linkedin,
      github: user.github,
      skills: user.skills,
      careerGoal: user.careerGoal,
      role: user.role,
      designation: user.designation,
      resumeUrl: user.resumeUrl,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, rollNumber, department, year, phone, linkedin, github, skills, careerGoal, resumeUrl, designation } = req.body;

    user.name = name || user.name;
    user.rollNumber = rollNumber !== undefined ? rollNumber : user.rollNumber;
    user.department = department !== undefined ? department : user.department;
    user.year = year !== undefined ? year : user.year;
    user.phone = phone !== undefined ? phone : user.phone;
    user.linkedin = linkedin !== undefined ? linkedin : user.linkedin;
    user.github = github !== undefined ? github : user.github;
    user.skills = skills || user.skills;
    user.careerGoal = careerGoal !== undefined ? careerGoal : user.careerGoal;
    user.resumeUrl = resumeUrl !== undefined ? resumeUrl : user.resumeUrl;
    user.designation = designation !== undefined ? designation : user.designation;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      rollNumber: updatedUser.rollNumber,
      department: updatedUser.department,
      year: updatedUser.year,
      phone: updatedUser.phone,
      linkedin: updatedUser.linkedin,
      github: updatedUser.github,
      skills: updatedUser.skills,
      careerGoal: updatedUser.careerGoal,
      role: updatedUser.role,
      designation: updatedUser.designation,
      resumeUrl: updatedUser.resumeUrl,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Promote a user to admin using secret key
// @route   POST /api/users/make-admin
// @access  Public (secret-protected)
const makeAdmin = async (req, res) => {
  try {
    const { email, secret } = req.body;
    if (!secret || secret !== envConfig.adminSecret) {
      return res.status(403).json({ message: 'Invalid admin secret' });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(404).json({ message: 'No account found with that email' });
    if (user.role === 'admin') return res.status(400).json({ message: 'This account is already an admin' });

    user.role = 'admin';
    await user.save();

    res.json({
      message: `${user.name} is now an admin. Please log in again to activate admin mode.`,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  makeAdmin,
};
