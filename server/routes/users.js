const express = require('express');
const router = express.Router();
const multer = require('multer');
const User = require('../models/User');

// Multer Config: Memory Storage (Files stored in RAM as Buffer)
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        const filetypes = /pdf|doc|docx/;
        const mimetype = filetypes.test(file.mimetype) ||
            file.mimetype === 'application/pdf' ||
            file.mimetype === 'application/msword' ||
            file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        if (mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only PDF/DOC files are allowed!'));
        }
    }
});

// Upload/Update Resume
router.post('/:id/resume', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }

        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Update user profile with file buffer
        user.profile.resumeData = req.file.buffer;
        user.profile.resumeContentType = req.file.mimetype;

        await user.save();

        res.json({ message: 'Resume uploaded to database successfully', hasResume: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Download Resume
router.get('/:id/resume/download', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || !user.profile.resumeData) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        res.set('Content-Type', user.profile.resumeContentType);
        res.set('Content-Disposition', `inline; filename="resume-${user.username}.${user.profile.resumeContentType.split('/')[1]}"`);
        res.send(user.profile.resumeData);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get User Profile (Metadata only)
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password -profile.resumeData'); // Exclude heavy buffer
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Add a flag to indicate if resume exists
        const userObj = user.toObject();
        userObj.hasResume = !!user.profile?.resumeContentType;

        res.json(userObj);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
