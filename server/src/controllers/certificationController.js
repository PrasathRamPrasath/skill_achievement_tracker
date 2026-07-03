import Certification from '../models/Certification.js';

// @desc    Get all certifications for a user
// @route   GET /api/certifications
// @access  Private
const getCertifications = async (req, res) => {
  try {
    const certifications = await Certification.find({ user: req.user._id }).sort({ date: -1 });
    res.json(certifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single certification
// @route   GET /api/certifications/:id
// @access  Private
const getCertification = async (req, res) => {
  try {
    const certification = await Certification.findById(req.params.id);
    if (!certification) {
      return res.status(404).json({ message: 'Certification not found' });
    }
    if (certification.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    res.json(certification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new certification
// @route   POST /api/certifications
// @access  Private
const createCertification = async (req, res) => {
  try {
    const { name, issuer, date, certificateUrl, imageUrl, skills } = req.body;

    const certification = await Certification.create({
      name,
      issuer,
      date,
      certificateUrl,
      imageUrl,
      skills,
      user: req.user._id,
    });

    res.status(201).json(certification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update certification
// @route   PUT /api/certifications/:id
// @access  Private
const updateCertification = async (req, res) => {
  try {
    const certification = await Certification.findById(req.params.id);
    if (!certification) {
      return res.status(404).json({ message: 'Certification not found' });
    }
    if (certification.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { name, issuer, date, certificateUrl, imageUrl, skills } = req.body;

    certification.name = name || certification.name;
    certification.issuer = issuer || certification.issuer;
    certification.date = date || certification.date;
    certification.certificateUrl = certificateUrl !== undefined ? certificateUrl : certification.certificateUrl;
    certification.imageUrl = imageUrl !== undefined ? imageUrl : certification.imageUrl;
    certification.skills = skills || certification.skills;

    const updatedCertification = await certification.save();
    res.json(updatedCertification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete certification
// @route   DELETE /api/certifications/:id
// @access  Private
const deleteCertification = async (req, res) => {
  try {
    const certification = await Certification.findById(req.params.id);
    if (!certification) {
      return res.status(404).json({ message: 'Certification not found' });
    }
    if (certification.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await certification.deleteOne();
    res.json({ message: 'Certification removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  getCertifications,
  getCertification,
  createCertification,
  updateCertification,
  deleteCertification,
};
