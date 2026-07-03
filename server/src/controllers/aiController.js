import axios from 'axios';
import envConfig from '../config/envConfig.js';
import User from '../models/User.js';
import Certification from '../models/Certification.js';
import Achievement from '../models/Achievement.js';
import Internship from '../models/Internship.js';
import Activity from '../models/Activity.js';

// @desc    Get AI advice for a student
// @route   POST /api/ai/advice
// @access  Private
const getAIAdvice = async (req, res) => {
  try {
    const { type } = req.body;
    const userId = req.user._id;

    // Fetch all user data in parallel
    const [user, certifications, achievements, internships, activities] = await Promise.all([
      User.findById(userId),
      Certification.find({ user: userId }),
      Achievement.find({ user: userId }),
      Internship.find({ user: userId }),
      Activity.find({ user: userId }),
    ]);

    const skills      = user.skills || [];
    const department  = user.department || 'engineering';
    const year        = user.year || 1;

    // Build structured profile context
    const certLines = certifications.length
      ? certifications.map((c) => `  - ${c.name} (${c.issuer})${c.skills?.length ? '; skills: ' + c.skills.join(', ') : ''}`).join('\n')
      : '  - none';

    const achieveLines = achievements.length
      ? achievements.map((a) => `  - ${a.title} [${a.category}, ${a.level} level]`).join('\n')
      : '  - none';

    const internLines = internships.length
      ? internships.map((i) => `  - ${i.role} at ${i.company}${i.skills?.length ? '; used: ' + i.skills.join(', ') : ''}`).join('\n')
      : '  - none';

    const activityLines = activities.length
      ? activities.map((a) => `  - ${a.name} (${a.type})${a.role ? ', role: ' + a.role : ''}`).join('\n')
      : '  - none';

    const profileContext = `
STUDENT PROFILE:
- Name: ${user.name}
- Department: ${department}
- Year: ${year}

SKILLS (${skills.length}):
${skills.length ? skills.map((s) => `  - ${s}`).join('\n') : '  - none yet'}

CERTIFICATIONS (${certifications.length}):
${certLines}

ACHIEVEMENTS (${achievements.length}):
${achieveLines}

INTERNSHIPS (${internships.length}):
${internLines}

EXTRA-CURRICULAR ACTIVITIES (${activities.length}):
${activityLines}
`.trim();

    let prompt = '';

    if (type === 'skill-gap') {
      prompt = `You are a career advisor for engineering students. Here is a student's complete profile:\n\n${profileContext}\n\nBased on this full profile, identify the top 5 skill gaps this student needs to fill to become job-ready. Be specific to their department and what they already have. Give clear, actionable advice for each gap.`;
    } else if (type === 'certifications') {
      prompt = `You are a career advisor for engineering students. Here is a student's complete profile:\n\n${profileContext}\n\nBased on their department, existing skills, certifications already earned, and internship experience, suggest the 5 most impactful certifications they should pursue next. For each, give a short name, the issuing body, and a specific reason why it fits this student's profile.`;
    } else if (type === 'learning-path') {
      prompt = `You are a career advisor for engineering students. Here is a student's complete profile:\n\n${profileContext}\n\nCreate a practical 3-month learning roadmap tailored to this student's current skills, gaps, and goals. Structure it as Week 1-4 (Month 1), Week 5-8 (Month 2), Week 9-12 (Month 3). Be specific — name tools, platforms, or resources where helpful. Keep it realistic for a college student.`;
    } else {
      return res.status(400).json({ message: 'Invalid advice type.' });
    }

    const response = await axios.post(
      `${envConfig.ollamaBaseUrl}/chat`,
      {
        model: envConfig.ollamaModel,
        messages: [{ role: 'user', content: prompt }],
        stream: false,
      },
      {
        headers: {
          Authorization: `Bearer ${envConfig.ollamaApiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 60000,
      }
    );

    const advice = response.data?.message?.content || response.data?.response || 'Sorry, no advice received.';
    res.json({ advice });
  } catch (error) {
    console.error('AI error:', error.message);
    res.status(500).json({ message: 'AI service is not available right now.' });
  }
};

export default { getAIAdvice };
