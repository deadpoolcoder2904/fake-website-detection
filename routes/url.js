const router = require('express').Router();
const { PythonShell } = require('python-shell');
const auth = require('../middleware/auth');
const path = require('path');

// Model for reported URLs
const mongoose = require('mongoose');
const reportedUrlSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['Phishing', 'Safe'],
        default: 'Phishing'
    },
    status: {
        type: String,
        enum: ['Pending', 'Verified'],
        default: 'Pending'
    },
    reason: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ReportedUrl = mongoose.model('ReportedUrl', reportedUrlSchema);

// Check URL route
router.post('/check', async (req, res) => {
    try {
        const { url } = req.body;
        
        if (!url) {
            return res.status(400).json({ message: 'URL is required' });
        }

        // First check if URL exists in reported URLs
        const reportedUrl = await ReportedUrl.findOne({ 
            url: { $regex: new RegExp(url, 'i') } // Case-insensitive search
        });

        if (reportedUrl) {
            return res.json({
                url,
                score: 1, // Highest risk score
                isSafe: false,
                safetyLevel: 'dangerous',
                message: 'This URL has been reported as potentially dangerous by our community!',
                isReported: true,
                reportDetails: {
                    reportedBy: reportedUrl.reportedBy,
                    dateReported: reportedUrl.createdAt,
                    reason: reportedUrl.reason
                }
            });
        }

        console.log('Checking URL:', url);
        
        // If not reported, proceed with ML model check
        let options = {
            mode: 'text',
            pythonPath: 'python',
            pythonOptions: ['-u'], // unbuffered output
            scriptPath: path.join(__dirname, '..', 'ml_model'),
            args: [url]
        };

        console.log('Python script path:', path.join(__dirname, '..', 'ml_model', 'check_url.py'));

        PythonShell.run('check_url.py', options)
            .then(results => {
                console.log('Python script results:', results);
                const score = parseFloat(results[0]);
                
                if (isNaN(score)) {
                    throw new Error('Invalid score returned from analysis');
                }
                
                // Determine safety level and message
                let safetyLevel;
                let message;
                
                if (score <= 0.2) {
                    safetyLevel = 'safe';
                    message = 'This website appears to be safe.';
                } else if (score <= 0.4) {
                    safetyLevel = 'probably_safe';
                    message = 'This website is probably safe, but exercise normal caution.';
                } else if (score <= 0.6) {
                    safetyLevel = 'uncertain';
                    message = 'Unable to determine if this website is safe. Exercise caution.';
                } else if (score <= 0.8) {
                    safetyLevel = 'suspicious';
                    message = 'This website shows some suspicious characteristics. Be careful!';
                } else {
                    safetyLevel = 'dangerous';
                    message = 'This website is likely dangerous. Avoid visiting it!';
                }
                
                res.json({
                    url,
                    score,
                    isSafe: score < 0.4,
                    safetyLevel,
                    message,
                    isReported: false
                });
            })
            .catch(err => {
                console.error('Python script error:', err);
                throw new Error(`Error analyzing URL: ${err.message}`);
            });
    } catch (error) {
        console.error('URL check error:', error);
        res.status(500).json({ 
            message: 'Error checking URL', 
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Report URL route (protected)
router.post('/report', auth, async (req, res) => {
    try {
        const { url, reason, type } = req.body;
        
        const reportedUrl = new ReportedUrl({
            url,
            reason,
            type: type || 'Phishing',
            reportedBy: req.user.userId
        });

        await reportedUrl.save();
        res.status(201).json({ message: 'URL reported successfully', reportedUrl });
    } catch (error) {
        res.status(500).json({ message: 'Error reporting URL', error: error.message });
    }
});

// Get all reported URLs (public)
router.get('/reported', async (req, res) => {
    try {
        const reportedUrls = await ReportedUrl.find()
            .populate('reportedBy', 'username')
            .sort('-createdAt')
            .lean()
            .exec();

        // Transform the data for frontend
        const formattedUrls = reportedUrls.map(url => ({
            url: url.url,
            type: url.type,
            reportedBy: url.reportedBy.username,
            dateReported: url.createdAt,
            status: url.status
        }));

        res.json(formattedUrls);
    } catch (error) {
        console.error('Error fetching reported URLs:', error);
        res.status(500).json({ message: 'Error fetching reported URLs', error: error.message });
    }
});

module.exports = router; 