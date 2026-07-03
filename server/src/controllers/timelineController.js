import Certification from '../models/Certification.js';
import Achievement from '../models/Achievement.js';
import Internship from '../models/Internship.js';
import Activity from '../models/Activity.js';
import Project from '../models/Project.js';

const getTimeline = async (req, res) => {
  try {
    const userId = req.user._id;

    const [certifications, achievements, internships, activities, projects] = await Promise.all([
      Certification.find({ user: userId }),
      Achievement.find({ user: userId }),
      Internship.find({ user: userId }),
      Activity.find({ user: userId }),
      Project.find({ user: userId }),
    ]);

    const items = [
      ...certifications.map((c) => ({
        _id: c._id,
        type: 'certification',
        title: c.name,
        subtitle: c.issuer,
        date: c.date,
        tags: c.skills,
        extra: null,
      })),
      ...achievements.map((a) => ({
        _id: a._id,
        type: 'achievement',
        title: a.title,
        subtitle: a.category,
        date: a.date,
        tags: [a.level],
        extra: a.description,
      })),
      ...internships.map((i) => ({
        _id: i._id,
        type: 'internship',
        title: i.role,
        subtitle: i.company,
        date: i.startDate,
        endDate: i.endDate,
        tags: i.skills,
        extra: i.description,
      })),
      ...activities.map((a) => ({
        _id: a._id,
        type: 'activity',
        title: a.name,
        subtitle: a.type,
        date: a.date,
        tags: a.role ? [a.role] : [],
        extra: a.description,
      })),
      ...projects.map((p) => ({
        _id: p._id,
        type: 'project',
        title: p.title,
        subtitle: p.role || p.status,
        date: p.startDate,
        endDate: p.endDate,
        tags: p.techStack,
        extra: p.description,
        links: { project: p.projectUrl, github: p.githubUrl },
      })),
    ];

    items.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default { getTimeline };
