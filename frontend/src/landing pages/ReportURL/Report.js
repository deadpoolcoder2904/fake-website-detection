import React from 'react';
import { useState } from 'react';
function Report() {
    const [formData, setFormData] = useState({
        url: '',
        category: '',
        reason: '',
        screenshot: null
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'screenshot') {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Submit formData to backend here
        alert("Report submitted. Thank you!");
    };
    return ( 
        <div className='container'>
            <h1 className='mt-5 text-muted fs-2' style={{marginLeft:"35%"}}>🚨 Report a Suspicious URL</h1>
            <p className='mt-3 text-muted fs-5' style={{marginLeft:"27%"}}>Help others by reporting dangerous
              websites that look fake or harmful.</p>
              <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="url" className="form-label fs-5">Suspicious URL</label>
                        <input
                            type="url"
                            className="form-control"
                            id="url"
                            name="url"
                            placeholder="http://phishy-site.com"
                            value={formData.url}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="category" className="form-label fs-5">Website Category</label>
                        <select
                            className="form-select"
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select type</option>
                            <option value="phishing">Phishing</option>
                            <option value="scam">Scam</option>
                            <option value="malware">Malware</option>
                            <option value="fake-login">Fake Login</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="reason" className="form-label fs-5">Why do you think it’s fake?</label>
                        <textarea
                            className="form-control"
                            id="reason"
                            name="reason"
                            rows="3"
                            placeholder="Short description"
                            value={formData.reason}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="screenshot" className="form-label fs-5">Upload Screenshot (optional)</label>
                        <input
                            type="file"
                            className="form-control"
                            id="screenshot"
                            name="screenshot"
                            accept="image/*"
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="btn btn-warning w-100 text-white fw-bold">
                        SUBMIT
                    </button>
                </form>
        </div>
    );
}

export default Report;