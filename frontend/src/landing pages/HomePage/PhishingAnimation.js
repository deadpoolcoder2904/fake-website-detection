import React from 'react';
import './PhishingAnimation.css';

const PhishingAnimation = () => {
    return (
        <div className="animation-container">
            <div className="phishing-scene">
                {/* Animated hacker silhouette */}
                <div className="hacker-container">
                    <div className="hacker">
                        <i className="fas fa-user-secret"></i>
                    </div>
                    <div className="hacker-glow"></div>
                </div>

                {/* Digital data stream */}
                <div className="data-stream">
                    {[...Array(15)].map((_, index) => (
                        <div key={index} className="data-particle" style={{ animationDelay: `${index * 0.2}s` }}>
                            {['$', '@', '#', '&', '*', '0', '1'][Math.floor(Math.random() * 7)]}
                        </div>
                    ))}
                </div>

                {/* Device with shield protection */}
                <div className="device-container">
                    <div className="device">
                        <div className="device-screen">
                            <div className="screen-content">
                                <div className="warning-badge">
                                    <i className="fas fa-exclamation-triangle"></i>
                                    <span>Phishing Detected</span>
                                </div>
                                <div className="protection-shield">
                                    <i className="fas fa-shield-alt"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Protection radius animation */}
                    <div className="protection-radius">
                        <div className="radius-ring"></div>
                        <div className="radius-ring"></div>
                        <div className="radius-ring"></div>
                    </div>
                </div>

                {/* Blocked attack indicators */}
                <div className="attack-indicators">
                    {[...Array(5)].map((_, index) => (
                        <div key={index} className="attack-block" style={{ animationDelay: `${index * 0.5}s` }}>
                            <i className="fas fa-times-circle"></i>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="protection-message">
                <i className="fas fa-check-circle"></i>
                <span>CyberEdge actively blocks phishing attempts</span>
            </div>
        </div>
    );
};

export default PhishingAnimation; 