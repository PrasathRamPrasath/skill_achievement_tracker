import User from '../models/User.js';
import Certification from '../models/Certification.js';
import Achievement from '../models/Achievement.js';
import Internship from '../models/Internship.js';
import Activity from '../models/Activity.js';
import Project from '../models/Project.js';

const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password').sort({ createdAt: -1 });

    const enriched = await Promise.all(
      students.map(async (s) => {
        const [certs, achievements, internships, activities, projects] = await Promise.all([
          Certification.countDocuments({ user: s._id }),
          Achievement.countDocuments({ user: s._id }),
          Internship.countDocuments({ user: s._id }),
          Activity.countDocuments({ user: s._id }),
          Project.countDocuments({ user: s._id }),
        ]);

        const allSkills = new Set([
          ...(s.skills || []),
        ]);
        const certsWithSkills = await Certification.find({ user: s._id });
        certsWithSkills.forEach(c => c.skills.forEach(sk => allSkills.add(sk)));
        const internsWithSkills = await Internship.find({ user: s._id });
        internsWithSkills.forEach(i => i.skills.forEach(sk => allSkills.add(sk)));

        return {
          _id: s._id,
          name: s.name,
          email: s.email,
          rollNumber: s.rollNumber,
          department: s.department,
          year: s.year,
          careerGoal: s.careerGoal,
          linkedin: s.linkedin,
          github: s.github,
          resumeUrl: s.resumeUrl,
          stats: {
            skills: allSkills.size,
            certifications: certs,
            achievements,
            internships,
            activities,
            projects,
            total: certs + achievements + internships + activities + projects,
          },
        };
      })
    );

    res.json(enriched);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStudentDetail = async (req, res) => {
  try {
    const student = await User.findOne({ _id: req.params.id, role: 'student' }).select('-password');
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const [certifications, achievements, internships, activities, projects] = await Promise.all([
      Certification.find({ user: student._id }),
      Achievement.find({ user: student._id }),
      Internship.find({ user: student._id }),
      Activity.find({ user: student._id }),
      Project.find({ user: student._id }),
    ]);

    res.json({ student, certifications, achievements, internships, activities, projects });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAdminStats = async (req, res) => {
  try {
    const [totalStudents, totalCerts, totalAchievements, totalInternships, totalProjects] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Certification.countDocuments(),
      Achievement.countDocuments(),
      Internship.countDocuments(),
      Project.countDocuments(),
    ]);

    const byDept = await User.aggregate([
      { $match: { role: 'student' } },
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const byYear = await User.aggregate([
      { $match: { role: 'student' } },
      { $group: { _id: '$year', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      totalStudents,
      totalCerts,
      totalAchievements,
      totalInternships,
      totalProjects,
      byDept,
      byYear,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default { getAllStudents, getStudentDetail, getAdminStats };
