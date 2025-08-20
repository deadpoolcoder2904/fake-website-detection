import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleReportClick = (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
        } else {
            navigate('/report');
        }
    };

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom sticky-top">
            <div className="container-fluid p-1">
                <Link className="navbar-brand" to="/">
                    <Logo />
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <form className="d-flex nav-opt" role="search">
                        <ul className="navbar-nav mb-lg-0">
                            <li className="nav-item">
                                <Link className={`nav-link ${isActive('/')}`} aria-current="page" to="/">
                                    HOME
                                </Link>
                            </li>
                            <li className="nav-item">
                                <button onClick={handleReportClick} className={`nav-link btn btn-link ${isActive('/report')}`}>
                                    REPORT URL
                                </button>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link ${isActive('/reported-urls')}`} to="/reported-urls">
                                    REPORTED URLS
                                </Link>
                            </li>
                            {user ? (
                                <>
                                    <li className="nav-item">
                                        <button onClick={handleLogout} className="nav-link btn btn-link">
                                            LOGOUT ({user.username})
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    {/* <li className="nav-item">
                                        <Link className={`nav-link ${isActive('/login')}`} to="/login">
                                            LOGIN
                                        </Link>
                                    </li> */}
                                    <li className="nav-item">
                                        <Link className={`nav-link ${isActive('/register')}`} to="/register" style={{marginRight:"1rem"}}>
                                            REGISTER
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </form>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;