import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { auth } from '../firebase/config';
import './Navbar.css';

const Navbar = () => {
    const { isDarkTheme } = useTheme();
    const [user, setUser] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        // Listen for auth state changes
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
        });

        // Cleanup subscription
        return () => unsubscribe();
    }, []);

    const handleSignOut = async () => {
        try {
            await auth.signOut();
            setShowDropdown(false);
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

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
                
                {user ? (
                    <div className="user-profile">
                        <div className="profile-trigger" onClick={toggleDropdown}>
                            {user.photoURL ? (
                                <img 
                                    src={user.photoURL} 
                                    alt="Profile" 
                                    className="profile-photo" 
                                />
                            ) : (
                                <div className="profile-initial">
                                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <span className="user-name">{user.displayName || user.email.split('@')[0]}</span>
                        </div>
                        
                        {showDropdown && (
                            <div className="profile-dropdown">
                                <Link to="/dashboard" onClick={() => setShowDropdown(false)}>Dashboard</Link>
                                <Link to="/profile" onClick={() => setShowDropdown(false)}>Profile</Link>
                                <button onClick={handleSignOut} className="sign-out-btn">Sign Out</button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to="/login" className="login-btn">login</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar; 