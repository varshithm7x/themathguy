import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import './Login.css';
import { auth } from '../firebase/config';
import { 
    GoogleAuthProvider, 
    signInWithPopup, 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} from 'firebase/auth';

const Login = () => {
    const { isDarkTheme } = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);

    const handleEmailPasswordSignIn = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            if (isSignUp) {
                // Create new user
                await createUserWithEmailAndPassword(auth, email, password);
                alert('Account created successfully!');
                setIsSignUp(false);
            } else {
                // Sign in existing user
                await signInWithEmailAndPassword(auth, email, password);
                alert('Logged in successfully!');
            }
        } catch (error) {
            console.error("Error with email/password auth:", error);
            setError(error.message);
        }
    };
    
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
            
            alert(`Welcome ${user.displayName || user.email}!`);
            
            // Redirect to homepage or dashboard
            // window.location.href = '/';
        } catch (error) {
            console.error("Error signing in with Google:", error);
            setError("Failed to sign in with Google. Please try again.");
        }
    };

    return (
        <div className="login-container dark">
            <div className="login-card">
                <h2>{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
                
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleEmailPasswordSignIn}>
                    <div className="input-group">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    <button type="submit" className="login-button">
                        {isSignUp ? 'Sign Up' : 'Login'}
                    </button>
                </form>
                
                <div className="divider">
                    <span>or</span>
                </div>
                
                <button 
                    onClick={handleGoogleSignIn} 
                    className="google-login-button"
                >
                    <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                    </svg>
                    Continue with Google
                </button>
                
                <div className="signup-option">
                    {isSignUp ? "Already have an account?" : "Don't have an account?"} 
                    <button 
                        type="button" 
                        className="toggle-signup"
                        onClick={() => setIsSignUp(!isSignUp)}
                    >
                        {isSignUp ? 'Login' : 'Sign Up'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login; 