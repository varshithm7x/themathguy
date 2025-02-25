import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="nav-brand">
                <Link to="/">TheMathGuy</Link>
            </div>
            <div className="nav-links">
                <Link to="/levels">Math Levels</Link>
                <Link to="/fields">Math Fields</Link>
                <Link to="/login" className="login-btn">Login</Link>
            </div>
        </nav>
    );
};

export default Navbar; 