import Achievement from '../models/Achievement.js';

// @desc    Get all achievements for a user
// @route   GET /api/achievements
// @access  Private
const getAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find({ user: req.user._id }).sort({ date: -1 });
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single achievement
// @route   GET /api/achievements/:id
// @access  Private
const getAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }
    if (achievement.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    res.json(achievement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new achievement
// @route   POST /api/achievements
// @access  Private
const createAchievement = async (req, res) => {
  try {
    const { title, description, date, category, level } = req.body;

    const achievement = await Achievement.create({
      title,
      description,
      date,
      category,
      level,
      user: req.user._id,
    });

    res.status(201).json(achievement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update achievement
// @route   PUT /api/achievements/:id
// @access  Private
const updateAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }
    if (achievement.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { title, description, date, category, level } = req.body;

    achievement.title = title || achievement.title;
    achievement.description = description || achievement.description;
    achievement.date = date || achievement.date;
    achievement.category = category || achievement.category;
    achievement.level = level || achievement.level;

    const updatedAchievement = await achievement.save();
    res.json(updatedAchievement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete achievement
// @route   DELETE /api/achievements/:id
// @access  Private
const deleteAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }
    if (achievement.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await achievement.deleteOne();
    res.json({ message: 'Achievement removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  getAchievements,
  getAchievement,
  createAchievement,
  updateAchievement,
  deleteAchievement,
};
