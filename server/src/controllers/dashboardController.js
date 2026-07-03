import User from '../models/User.js';
import Certification from '../models/Certification.js';
import Achievement from '../models/Achievement.js';
import Internship from '../models/Internship.js';
import Activity from '../models/Activity.js';
import Project from '../models/Project.js';

const getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;

    const [user, certifications, achievements, internships, activities, projects] = await Promise.all([
      User.findById(userId).select('-password'),
      Certification.find({ user: userId }),
      Achievement.find({ user: userId }),
      Internship.find({ user: userId }),
      Activity.find({ user: userId }),
      Project.find({ user: userId }),
    ]);

    const totalSkills = new Set();
    certifications.forEach(cert => cert.skills.forEach(skill => totalSkills.add(skill)));
    internships.forEach(int => int.skills.forEach(skill => totalSkills.add(skill)));
    projects.forEach(p => p.techStack.forEach(skill => totalSkills.add(skill)));
    if (user.skills) user.skills.forEach(skill => totalSkills.add(skill));

    // --- Chart data ---

    // Monthly activity additions (last 6 months)
    const monthlyMap = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthlyMap[key] = { month: key, certifications: 0, achievements: 0, internships: 0, activities: 0, projects: 0 };
    }

    const toKey = (date) => {
      const d = new Date(date);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    };

    certifications.forEach(c => { const k = toKey(c.date); if (monthlyMap[k]) monthlyMap[k].certifications++; });
    achievements.forEach(a => { const k = toKey(a.date); if (monthlyMap[k]) monthlyMap[k].achievements++; });
    internships.forEach(i => { const k = toKey(i.startDate); if (monthlyMap[k]) monthlyMap[k].internships++; });
    activities.forEach(a => { const k = toKey(a.date); if (monthlyMap[k]) monthlyMap[k].activities++; });
    projects.forEach(p => { const k = toKey(p.startDate); if (monthlyMap[k]) monthlyMap[k].projects++; });

    const monthlyChart = Object.values(monthlyMap);

    // Achievement breakdown by category
    const achCategoryMap = {};
    achievements.forEach(a => {
      achCategoryMap[a.category] = (achCategoryMap[a.category] || 0) + 1;
    });
    const achievementsByCategory = Object.entries(achCategoryMap).map(([name, value]) => ({ name, value }));

    // Activity breakdown by type
    const actTypeMap = {};
    activities.forEach(a => {
      actTypeMap[a.type] = (actTypeMap[a.type] || 0) + 1;
    });
    const activitiesByType = Object.entries(actTypeMap).map(([name, value]) => ({ name, value }));

    // Project status breakdown
    const projStatusMap = {};
    projects.forEach(p => {
      projStatusMap[p.status] = (projStatusMap[p.status] || 0) + 1;
    });
    const projectsByStatus = Object.entries(projStatusMap).map(([name, value]) => ({ name, value }));

    res.json({
      user: {
        name: user.name,
        email: user.email,
        rollNumber: user.rollNumber,
        department: user.department,
        year: user.year,
        careerGoal: user.careerGoal,
        role: user.role,
      },
      stats: {
        totalSkills: totalSkills.size,
        totalCertifications: certifications.length,
        totalAchievements: achievements.length,
        totalInternships: internships.length,
        totalActivities: activities.length,
        totalProjects: projects.length,
      },
      recentCertifications: certifications.slice(0, 5),
      recentAchievements: achievements.slice(0, 5),
      recentInternships: internships.slice(0, 5),
      recentActivities: activities.slice(0, 5),
      recentProjects: projects.slice(0, 5),
      allSkills: Array.from(totalSkills),
      charts: {
        monthlyActivity: monthlyChart,
        achievementsByCategory,
        activitiesByType,
        projectsByStatus,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default { getDashboardData };
