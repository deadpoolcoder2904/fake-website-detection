import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './ReportURL.css';

const ReportURL = () => {
    const [url, setUrl] = useState('');
    const [reason, setReason] = useState('');
    const [category, setCategory] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    // Redirect if not logged in
    React.useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await axios.post('http://localhost:5000/api/url/report', {
                url,
                reason,
                category
            });
            
            setSuccess('URL reported successfully!');
            setUrl('');
            setReason('');
            setCategory('');
        } catch (err) {
            setError(err.response?.data?.message || 'Error reporting URL');
        }
    };

    if (!user) {
        return null; // Don't render anything while redirecting
    }

    return (
        <div className="report-container">
            <div className="report-form">
                <h2>Report Suspicious URL</h2>
                <p className="description">Help protect our community by reporting potentially dangerous websites. Your report will be reviewed and added to our database.</p>
                
                <form onSubmit={handleSubmit}>
                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}
                    
                    <div className="form-group">
                        <label htmlFor="url">Suspicious URL</label>
                        <input
                            type="url"
                            id="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            required
                            placeholder="Enter the suspicious website URL"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="category">Website Category</label>
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        >
                            <option value="">Select category</option>
                            <option value="phishing">Phishing</option>
                            <option value="scam">Scam</option>
                            <option value="malware">Malware</option>
                            <option value="fake-login">Fake Login</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="reason">Reason for Reporting</label>
                        <textarea
                            id="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            required
                            placeholder="Please explain why you think this URL is suspicious"
                            rows={4}
                        />
                    </div>

                    <button type="submit" className="report-button">Report URL</button>
                </form>
            </div>
        </div>
    );
};

export default ReportURL; 