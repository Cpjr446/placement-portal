const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const User = require('../models/User');

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${req.params.id}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        const filetypes = /pdf|doc|docx/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only resume files (PDF, DOC, DOCX) are allowed!'));
        }
    }
});

// Update Profile (Resume)
router.post('/:id/resume', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }

        const resumePath = `/uploads/${req.file.filename}`;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { 'profile.resumeLink': resumePath },
            { new: true }
        );

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({ message: 'Resume uploaded successfully', resumeLink: resumePath, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get User Profile
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
