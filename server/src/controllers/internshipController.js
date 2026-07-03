import Internship from '../models/Internship.js';

// @desc    Get all internships for a user
// @route   GET /api/internships
// @access  Private
const getInternships = async (req, res) => {
  try {
    const internships = await Internship.find({ user: req.user._id }).sort({ startDate: -1 });
    res.json(internships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single internship
// @route   GET /api/internships/:id
// @access  Private
const getInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }
    if (internship.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    res.json(internship);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new internship
// @route   POST /api/internships
// @access  Private
const createInternship = async (req, res) => {
  try {
    const { company, role, startDate, endDate, description, skills } = req.body;

    const internship = await Internship.create({
      company,
      role,
      startDate,
      endDate,
      description,
      skills,
      user: req.user._id,
    });

    res.status(201).json(internship);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update internship
// @route   PUT /api/internships/:id
// @access  Private
const updateInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }
    if (internship.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { company, role, startDate, endDate, description, skills } = req.body;

    internship.company = company || internship.company;
    internship.role = role || internship.role;
    internship.startDate = startDate || internship.startDate;
    internship.endDate = endDate !== undefined ? endDate : internship.endDate;
    internship.description = description || internship.description;
    internship.skills = skills || internship.skills;

    const updatedInternship = await internship.save();
    res.json(updatedInternship);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete internship
// @route   DELETE /api/internships/:id
// @access  Private
const deleteInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }
    if (internship.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await internship.deleteOne();
    res.json({ message: 'Internship removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  getInternships,
  getInternship,
  createInternship,
  updateInternship,
  deleteInternship,
};
