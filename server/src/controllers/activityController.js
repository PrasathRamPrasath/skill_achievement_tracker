import Activity from '../models/Activity.js';

// @desc    Get all activities for a user
// @route   GET /api/activities
// @access  Private
const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.user._id }).sort({ date: -1 });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single activity
// @route   GET /api/activities/:id
// @access  Private
const getActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    if (activity.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new activity
// @route   POST /api/activities
// @access  Private
const createActivity = async (req, res) => {
  try {
    const { name, type, role, date, description } = req.body;

    const activity = await Activity.create({
      name,
      type,
      role,
      date,
      description,
      user: req.user._id,
    });

    res.status(201).json(activity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update activity
// @route   PUT /api/activities/:id
// @access  Private
const updateActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    if (activity.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { name, type, role, date, description } = req.body;

    activity.name = name || activity.name;
    activity.type = type || activity.type;
    activity.role = role !== undefined ? role : activity.role;
    activity.date = date || activity.date;
    activity.description = description || activity.description;

    const updatedActivity = await activity.save();
    res.json(updatedActivity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete activity
// @route   DELETE /api/activities/:id
// @access  Private
const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    if (activity.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await activity.deleteOne();
    res.json({ message: 'Activity removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  getActivities,
  getActivity,
  createActivity,
  updateActivity,
  deleteActivity,
};
