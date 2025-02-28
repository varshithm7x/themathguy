import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

const Navbar = () => {
    const { isDarkTheme } = useTheme();

    return (
        <nav className={`navbar ${isDarkTheme ? 'dark' : 'light'}`}>
            <div className="nav-brand">
                <Link to="/">
                    <img 
                        src={isDarkTheme ? "/image.png" : "/math-light.png"} 
                        alt="Logo" 
                        className="nav-logo" 
                    />
                </Link>
            </div>
            <div className="nav-links">
                <Link to="/courses">courses</Link>
                <Link to="/help">help</Link>
                <Link to="/about">about us</Link>
                <Link to="/login" className="login-btn">login</Link>
            </div>
        </nav>
    );
};

export default Navbar; 