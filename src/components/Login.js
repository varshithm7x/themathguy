import React, { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import './Login.css';

const Login = () => {
    const { isDarkTheme } = useTheme();

    useEffect(() => {
        // Load the Google Identity Services script
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        script.onload = () => {
            window.google.accounts.id.initialize({
                client_id: '252083625732-i92gqsrghl2p5sj5oiuoq2g0vn4l597f.apps.googleusercontent.com',
                callback: handleCredentialResponse,
                ux_mode: 'redirect',
                redirect_uri: window.location.origin + '/login'
            });
            window.google.accounts.id.renderButton(
                document.getElementById('google-signin-button'),
                { theme: isDarkTheme ? 'filled_black' : 'outline', size: 'large', text: 'signin_with' }
            );
        };

        return () => {
            document.body.removeChild(script);
        };
    }, [isDarkTheme]);

    const handleCredentialResponse = (response) => {
        console.log("Google response:", response);
        // Process the JWT token
        try {
            // You can use the token to authenticate with your backend
            const token = response.credential;
            console.log("Token:", token);
            
            // Decode the token to get user info (client-side only)
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            
            const decoded = JSON.parse(jsonPayload);
            console.log("Decoded:", decoded);
            alert("Login successful! Welcome " + decoded.name);
        } catch (error) {
            console.error("Error processing token:", error);
        }
    };

    return (
        <div className={`login-container ${isDarkTheme ? 'dark' : 'light'}`}>
            <div className="login-card">
                <h2>Login to Your Account</h2>
                <p>Use your Google account to sign in</p>
                
                <div id="google-signin-button" className="google-login-wrapper"></div>
                
                <div className="login-footer">
                    <p>By logging in, you agree to our Terms of Service and Privacy Policy</p>
                </div>
            </div>
        </div>
    );
};

export default Login; 