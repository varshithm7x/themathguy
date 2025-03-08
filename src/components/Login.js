import React, { useEffect } from 'react';
import './Login.css';

const Login = () => {
    useEffect(() => {
        // Create a simple button that opens Google login in a new window
        const loginButton = document.getElementById('manual-google-login');
        if (loginButton) {
            loginButton.addEventListener('click', () => {
                const clientId = '252083625732-i92gqsrghl2p5sj5oiuoq2g0vn4l597f.apps.googleusercontent.com';
                const redirectUri = encodeURIComponent(window.location.origin + '/login');
                const scope = encodeURIComponent('email profile');
                const responseType = 'token';
                const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}`;
                
                window.open(authUrl, 'Google Login', 'width=500,height=600');
            });
        }
    }, []);

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Login to Your Account</h2>
                <p>Use your Google account to sign in</p>
                
                <button id="manual-google-login" className="google-login-button">
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