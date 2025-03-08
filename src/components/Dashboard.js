import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { auth } from '../firebase/config';
import './Dashboard.css';

const Dashboard = () => {
    const { isDarkTheme } = useTheme();
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                // Redirect to login if not logged in
                navigate('/login');
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const handleSignOut = async () => {
        try {
            await auth.signOut();
            navigate('/login');
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    if (!user) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className={`dashboard-container ${isDarkTheme ? 'dark' : 'light'}`}>
            <div className="dashboard-header">
                <h1>Welcome to Your Dashboard</h1>
                <p>Hello, {user.displayName || user.email}!</p>
            </div>

            <div className="dashboard-content">
                <div className="dashboard-card">
                    <h2>Your Learning Progress</h2>
                    <div className="progress-container">
                        <div className="progress-bar" style={{ width: '45%' }}>
                            <span>45%</span>
                        </div>
                    </div>
                    <p>You're making great progress! Keep it up.</p>
                </div>

                <div className="dashboard-card">
                    <h2>Recent Courses</h2>
                    <ul className="course-list">
                        <li>
                            <span className="course-name">Algebra Fundamentals</span>
                            <span className="course-progress">In Progress</span>
                        </li>
                        <li>
                            <span className="course-name">Calculus I</span>
                            <span className="course-progress">Not Started</span>
                        </li>
                        <li>
                            <span className="course-name">Geometry Basics</span>
                            <span className="course-progress">Completed</span>
                        </li>
                    </ul>
                </div>
            </div>

            <button onClick={handleSignOut} className="sign-out-button">
                Sign Out
            </button>
        </div>
    );
};

export default Dashboard; 