import React, { useState, useEffect } from 'react';
import './ReportedURLs.css';

const ReportedURLs = () => {
    const [reportedUrls, setReportedUrls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReportedUrls = async () => {
            try {
                console.log('Fetching reported URLs...');
                const response = await fetch('http://localhost:5000/api/url/reported');
                
                console.log('Response status:', response.status);
                
                if (!response.ok) {
                    const errorData = await response.text();
                    console.error('Error response:', errorData);
                    throw new Error(`Failed to fetch reported URLs: ${errorData}`);
                }
                
                const data = await response.json();
                console.log('Fetched data:', data);
                setReportedUrls(data);
                setLoading(false);
            } catch (err) {
                console.error('Fetch error:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchReportedUrls();
    }, []);

    if (loading) {
        return (
            <div className="reported-urls-container">
                <div className="loading">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading reported URLs...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="reported-urls-container">
                <div className="error">
                    <h3>Error Loading Data</h3>
                    <p>{error}</p>
                    <button 
                        className="btn btn-primary mt-3"
                        onClick={() => window.location.reload()}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="reported-urls-container">
            <h2>Reported URLs Database</h2>
            <p className="text-center mb-4">
                A comprehensive list of URLs reported by our community. These URLs have been analyzed for potential phishing threats.
            </p>
            {reportedUrls.length === 0 ? (
                <div className="no-urls">
                    <i className="fas fa-info-circle me-2"></i>
                    No URLs have been reported yet.
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>URL</th>
                                <th>Type</th>
                                <th>Reported By</th>
                                <th>Date Reported</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportedUrls.map((url, index) => (
                                <tr key={index}>
                                    <td>
                                        <a href={url.url} target="_blank" rel="noopener noreferrer" className="url-link">
                                            {url.url}
                                        </a>
                                    </td>
                                    <td>
                                        <span className={`badge bg-${url.type === 'Phishing' ? 'danger' : 'success'}`}>
                                            {url.type}
                                        </span>
                                    </td>
                                    <td>{url.reportedBy}</td>
                                    <td>{new Date(url.dateReported).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`badge bg-${url.status === 'Verified' ? 'success' : 'warning'}`}>
                                            {url.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ReportedURLs; 