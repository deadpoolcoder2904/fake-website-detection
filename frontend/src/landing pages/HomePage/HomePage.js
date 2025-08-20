import React from 'react';
import Check from './Check';
import './HomePage.css';

const HomePage = () => {
    return (
        <>
            {/* Animated Background - Moved outside container */}
            <div className="cyber-background">
                <div className="grid-overlay"></div>
                {/* Floating Security Elements */}
                {[...Array(20)].map((_, index) => (
                    <div 
                        key={index} 
                        className="security-icon"
                        style={{
                            animationDelay: `${index * 0.5}s`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`
                        }}
                    >
                        <i className={`fas fa-${[
                            'shield-alt',
                            'lock',
                            'user-shield',
                            'fingerprint',
                            'key'
                        ][Math.floor(Math.random() * 5)]}`}></i>
                    </div>
                ))}
                
                {/* Animated Lines */}
                <div className="cyber-lines">
                    {[...Array(10)].map((_, index) => (
                        <div 
                            key={index} 
                            className="cyber-line"
                            style={{
                                animationDelay: `${index * 0.3}s`,
                                width: `${Math.random() * 200 + 100}px`,
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`
                            }}
                        ></div>
                    ))}
                </div>

                {/* Binary Rain */}
                <div className="binary-rain">
                    {[...Array(30)].map((_, index) => (
                        <div 
                            key={index} 
                            className="binary-column"
                            style={{
                                animationDelay: `${index * 0.15}s`,
                                left: `${(index / 30) * 100}%`
                            }}
                        >
                            {[...Array(20)].map((_, i) => (
                                <span key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                                    {Math.random() > 0.5 ? '1' : '0'}
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="home-container">
                <div className="content-wrapper">
                    <div className='text-center'>
                        <h1 className='mb-2 fs-1'>Protect You from Phishing Attacks</h1>
                        <p style={{fontSize:"20px"}} className='text-muted mb-5'>
                            Don't get caught in a <b style={{color:"#00ff9d"}}>phishing trap</b>. 
                            Happens 2.6 million times a year, but with our website you can protect yourself
                        </p>
                    </div>
                    <Check />
                </div>
            </div>
        </>
    );
};

export default HomePage;