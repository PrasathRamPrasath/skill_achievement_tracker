import User from '../models/User.js';
import Certification from '../models/Certification.js';
import Achievement from '../models/Achievement.js';
import Internship from '../models/Internship.js';
import Activity from '../models/Activity.js';

// @desc    Get dashboard data for a user
// @route   GET /api/dashboard
// @access  Private
const getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select('-password');
    const certifications = await Certification.find({ user: userId });
    const achievements = await Achievement.find({ user: userId });
    const internships = await Internship.find({ user: userId });
    const activities = await Activity.find({ user: userId });

    // Calculate aggregated data
    const totalSkills = new Set();
    certifications.forEach(cert => cert.skills.forEach(skill => totalSkills.add(skill)));
    internships.forEach(int => int.skills.forEach(skill => totalSkills.add(skill)));
    if (user.skills) {
      user.skills.forEach(skill => totalSkills.add(skill));
    }

    const dashboardData = {
      user: {
        name: user.name,
        email: user.email,
        rollNumber: user.rollNumber,
        department: user.department,
        year: user.year,
      },
      stats: {
        totalSkills: totalSkills.size,
        totalCertifications: certifications.length,
        totalAchievements: achievements.length,
        totalInternships: internships.length,
        totalActivities: activities.length,
      },
      recentCertifications: certifications.slice(0, 5),
      recentAchievements: achievements.slice(0, 5),
      recentInternships: internships.slice(0, 5),
      recentActivities: activities.slice(0, 5),
      allSkills: Array.from(totalSkills),
    };

    res.json(dashboardData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  getDashboardData,
};
