import React, { useState } from 'react';
import axios from 'axios';
import './Check.css';

const Check = () => {
    const [url, setUrl] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const validateUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);

        let processedUrl = url;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            processedUrl = 'http://' + url;
        }

        if (!validateUrl(processedUrl)) {
            setError('Please enter a valid URL');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/url/check', { url: processedUrl });
            if (response.data) {
                setResult(response.data);
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (err) {
            console.error('Error details:', err);
            setError(
                err.response?.data?.message || 
                err.response?.data?.error || 
                err.message || 
                'Error checking URL. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const getSafetyColor = (safetyLevel) => {
        switch (safetyLevel) {
            case 'safe': return '#28a745';
            case 'probably_safe': return '#88c74c';
            case 'uncertain': return '#ffc107';
            case 'suspicious': return '#dc3545';
            case 'dangerous': return '#721c24';
            default: return '#6c757d';
        }
    };

    return (
        <div className="check-container">
            {/* Scanner Animation */}
            <div className="scanner-animation">
                <div className="scanner-shield">
                    <i className="fas fa-shield-alt"></i>
                    <div className="scanner-beam"></div>
                </div>
                <div className="scanner-circles">
                    <div className="circle"></div>
                    <div className="circle"></div>
                    <div className="circle"></div>
                </div>
                <div className="scanner-dots">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="dot" style={{ animationDelay: `${i * 0.2}s` }}></div>
                    ))}
                </div>
            </div>

            <h2 className="scan-title">Check Website Safety</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Enter website URL"
                        required
                        className="url-input"
                    />
                    <button type="submit" disabled={loading} className="check-button">
                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                <span>Scanning...</span>
                            </>
                        ) : (
                            <>
                                <i className="fas fa-search"></i>
                                <span>Check URL</span>
                            </>
                        )}
                    </button>
                </div>
            </form>

            {error && <div className="error-message">{error}</div>}
            
            {result && (
                <div className={`result-container ${result.safetyLevel}`}>
                    <h3>Results:</h3>
                    <div className="safety-score">
                        <div className="score-bar">
                            <div 
                                className="score-fill" 
                                style={{
                                    width: `${(1 - result.score) * 100}%`,
                                    backgroundColor: getSafetyColor(result.safetyLevel)
                                }}
                            />
                        </div>
                        <p>Safety Score: {((1 - result.score) * 100).toFixed(1)}%</p>
                    </div>
                    <p className="verdict" style={{ color: getSafetyColor(result.safetyLevel) }}>
                        {result.message}
                    </p>

                    {result.isReported && result.reportDetails && (
                        <div className="reported-warning">
                            <h4>⚠️ Community Warning</h4>
                            <p>This URL was reported by our community on {new Date(result.reportDetails.dateReported).toLocaleDateString()}</p>
                            {result.reportDetails.reason && (
                                <div className="report-reason">
                                    <strong>Reason:</strong> {result.reportDetails.reason}
                                </div>
                            )}
                        </div>
                    )}

                    {!result.isSafe && (
                        <div className="warning-box">
                            <h4>⚠️ Safety Tips:</h4>
                            <ul>
                                <li>Don't enter personal information on this site</li>
                                <li>Be cautious of downloading files</li>
                            </ul>
                        </div>
                    )}
                </div>
            )}

            <style jsx>{`
                .check-container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 2rem;
                }

                .input-group {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 1rem;
                }

                .url-input {
                    flex: 1;
                    padding: 0.75rem;
                    font-size: 1rem;
                    border: 2px solid #ddd;
                    border-radius: 4px;
                }

                .check-button {
                    padding: 0.75rem 1.5rem;
                    font-size: 1rem;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }

                .check-button:hover {
                    background-color: #0056b3;
                }

                .check-button:disabled {
                    background-color: #ccc;
                    cursor: not-allowed;
                }

                .error-message {
                    color: #dc3545;
                    margin: 1rem 0;
                    padding: 0.5rem;
                    background-color: #f8d7da;
                    border-radius: 4px;
                }

                .result-container {
                    margin-top: 2rem;
                    padding: 1.5rem;
                    border-radius: 8px;
                    background-color: #fff;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }

                .safety-score {
                    margin: 1.5rem 0;
                }

                .score-bar {
                    height: 24px;
                    background-color: #f0f0f0;
                    border-radius: 12px;
                    overflow: hidden;
                    margin-bottom: 0.5rem;
                }

                .score-fill {
                    height: 100%;
                    transition: width 0.3s ease;
                }

                .verdict {
                    font-size: 1.2rem;
                    font-weight: bold;
                    margin: 1rem 0;
                    text-align: center;
                }

                .warning-box {
                    margin-top: 1.5rem;
                    padding: 1rem;
                    background-color: #fff3cd;
                    border: 1px solid #ffeeba;
                    border-radius: 4px;
                }

                .warning-box h4 {
                    color: #856404;
                    margin-bottom: 0.5rem;
                }

                .warning-box ul {
                    margin: 0;
                    padding-left: 1.5rem;
                    color: #856404;
                }

                .warning-box li {
                    margin: 0.25rem 0;
                }
            `}</style>
        </div>
    );
};

export default Check;
