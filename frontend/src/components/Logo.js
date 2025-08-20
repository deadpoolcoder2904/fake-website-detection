import React from 'react';
import './Logo.css';

const Logo = () => {
    return (
        <div className="logo-container">
            <div className="logo-shield">
                <i className="fas fa-shield-alt"></i>
            </div>
            <div className="logo-text">
                <span className="cyber">Cyber</span>
                <span className="edge">Edge</span>
            </div>
            <div className="logo-glow"></div>
        </div>
    );
};

export default Logo; 