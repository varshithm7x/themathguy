import React from 'react';
import { useTheme } from '../context/ThemeContext';
import './Login.css';
import { auth } from '../firebase/config';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const Login = () => {
    const { isDarkTheme } = useTheme();
    
    const handleGoogleSignIn = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            
            // The signed-in user info
            const user = result.user;
            console.log("Successfully signed in:", user);
            
            // You can store user info in localStorage or context
            localStorage.setItem('user', JSON.stringify({
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                uid: user.uid
            }));
            
            alert(`Welcome ${user.displayName}!`);
            
            // Redirect to homepage or dashboard
            // window.location.href = '/';
        } catch (error) {
            console.error("Error signing in with Google:", error);
            alert("Failed to sign in with Google. Please try again.");
        }
    };

    return (
        <div className={`login-container ${isDarkTheme ? 'dark' : 'light'}`}>
            <div className="login-card">
                <h2>Login to Your Account</h2>
                <p>Use your Google account to sign in</p>
                
                <button 
                    onClick={handleGoogleSignIn} 
                    className="google-btn"
                >
                    <img 
                        src={isDarkTheme ? "/google-icon-light.png" : "/google-icon-dark.png"} 
                        alt="Google" 
                    />
                    Sign in with Google
                </button>
                
                <div className="login-footer">
                    <p>By logging in, you agree to our Terms of Service and Privacy Policy</p>
                </div>
            </div>
        </div>
    );
};

export default Login; 