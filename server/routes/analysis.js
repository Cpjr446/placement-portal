const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const User = require('../models/User');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const pdf = require('pdf-parse');
const dotenv = require('dotenv');

dotenv.config();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Analyze Job Compatibility
router.post('/analyze/:jobId', async (req, res) => {
    try {
        const { userId } = req.body; // Passed from frontend or extracted from token middleware

        if (!userId) return res.status(400).json({ message: 'User ID required' });

        const job = await Job.findById(req.params.jobId);
        const user = await User.findById(userId);

        if (!job) return res.status(404).json({ message: 'Job not found' });
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (!user.profile.resumeData) return res.status(400).json({ message: 'No resume found. Please upload one first.' });

        // 1. Extract Text from Resume PDF
        let resumeText = '';
        try {
            const pdfData = await pdf(user.profile.resumeData);
            resumeText = pdfData.text;
        } catch (err) {
            console.error('PDF Parse Error:', err);
            return res.status(500).json({ message: 'Failed to extract text from resume PDF.' });
        }

        // 2. Construct Prompt for Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `
        Act as an expert Recruiter and Technical Hiring Manager.
        I will provide you with a Job Description and a Candidate's Resume.
        
        Your task is to:
        1. Evaluate the relevance of the resume to the job.
        2. Provide a "Match Score" from 0 to 100.
        3. List 3 key strengths of the candidate for this role.
        4. List 3 critical missing skills or areas for improvement.

        JOB DESCRIPTION:
        Title: ${job.title}
        Company: ${job.company}
        Description: ${job.description}
        Requirements: ${job.requirements.join(', ')}

        CANDIDATE RESUME:
        ${resumeText.substring(0, 8000)} // Truncate to avoid token limits if super long

        OUTPUT FORMAT (JSON ONLY):
        {
            "score": number,
            "strengths": ["string", "string", "string"],
            "missingSkills": ["string", "string", "string"],
            "summary": "string"
        }
        `;

        // 3. Generate Analysis
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up JSON tags if Gemini includes them
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const analysis = JSON.parse(cleanedText);

        res.json(analysis);

    } catch (error) {
        console.error('Analysis Error:', error);
        res.status(500).json({ message: 'AI Analysis failed', error: error.message });
    }
});

module.exports = router;
