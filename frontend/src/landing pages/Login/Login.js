import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const result = await login(email, password);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                {error && <div className="error-message">{error}</div>}
                
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="login-button">Login</button>
            </form>

            <p className="register-link">
                Don't have an account? <a href="/register">Register here</a>
            </p>

            <style jsx>{`
                .login-container {
                    max-width: 400px;
                    margin: 2rem auto;
                    padding: 2rem;
                    background: linear-gradient(145deg, rgba(26, 32, 44, 0.95), rgba(17, 19, 23, 0.95));
                    border-radius: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                }

                h2 {
                    text-align: center;
                    margin-bottom: 2rem;
                    color: #ffffff;
                    font-weight: 600;
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                }

                .form-group {
                    margin-bottom: 1.5rem;
                }

                label {
                    display: block;
                    margin-bottom: 0.5rem;
                    color: rgba(255, 255, 255, 0.9);
                    font-weight: 500;
                }

                input {
                    width: 100%;
                    padding: 0.75rem;
                    font-size: 1rem;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    color: #ffffff;
                    transition: all 0.3s ease;
                }

                input:focus {
                    border-color: #00ff9d;
                    box-shadow: 0 0 0 2px rgba(0, 255, 157, 0.2);
                    outline: none;
                    background: rgba(255, 255, 255, 0.08);
                }

                input::placeholder {
                    color: rgba(255, 255, 255, 0.4);
                }

                .login-button {
                    width: 100%;
                    padding: 0.75rem;
                    background: linear-gradient(90deg, #00ff9d, #00cc7d);
                    color: #1a202c;
                    border: none;
                    border-radius: 8px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .login-button:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 5px 15px rgba(0, 255, 157, 0.2);
                }

                .error-message {
                    color: #ff5b5b;
                    margin-bottom: 1rem;
                    text-align: center;
                    padding: 0.75rem;
                    background: rgba(255, 91, 91, 0.1);
                    border: 1px solid rgba(255, 91, 91, 0.2);
                    border-radius: 8px;
                }

                .register-link {
                    text-align: center;
                    margin-top: 1.5rem;
                    color: rgba(255, 255, 255, 0.7);
                }

                .register-link a {
                    color: #00ff9d;
                    text-decoration: none;
                    font-weight: 500;
                }

                .register-link a:hover {
                    text-decoration: underline;
                    color: #00cc7d;
                }
            `}</style>
        </div>
    );
};

export default Login;