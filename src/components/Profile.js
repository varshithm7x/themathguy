import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { auth, storage } from '../firebase/config';
import { updateProfile, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './Profile.css';

const Profile = () => {
    const { isDarkTheme } = useTheme();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    
    // Form fields
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [bio, setBio] = useState('');
    const [interests, setInterests] = useState([]);
    const [newInterest, setNewInterest] = useState('');
    
    // Profile photo
    const [photoURL, setPhotoURL] = useState('');
    const [photoFile, setPhotoFile] = useState(null);
    const fileInputRef = useRef(null);
    
    // Tabs
    const [activeTab, setActiveTab] = useState('general');
    
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setDisplayName(currentUser.displayName || '');
                setEmail(currentUser.email || '');
                
                // Make sure we're getting the photoURL correctly
                if (currentUser.photoURL) {
                    console.log("User photo URL:", currentUser.photoURL);
                    setPhotoURL(currentUser.photoURL);
                } else {
                    setPhotoURL('');
                }
                
                setLoading(false);
            } else {
                navigate('/login');
            }
        });
        
        return () => unsubscribe();
    }, [navigate]);
    
    const handlePhotoClick = () => {
        fileInputRef.current.click();
    };
    
    const handlePhotoChange = (e) => {
        if (e.target.files[0]) {
            const file = e.target.files[0];
            setPhotoFile(file);
            
            // Just use URL.createObjectURL for the preview
            setPhotoURL(URL.createObjectURL(file));
        }
    };
    
    const handleAddInterest = () => {
        if (newInterest.trim() && !interests.includes(newInterest.trim())) {
            setInterests([...interests, newInterest.trim()]);
            setNewInterest('');
        }
    };
    
    const handleRemoveInterest = (interest) => {
        setInterests(interests.filter(item => item !== interest));
    };
    
    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ text: '', type: '' });
        
        try {
            // Update display name if changed
            if (displayName !== user.displayName) {
                await updateProfile(user, { displayName });
            }
            
            // Upload profile photo if changed
            if (photoFile) {
                try {
                    // Create a reference to the user's profile photo
                    const storageRef = ref(storage, `profile_photos/${user.uid}`);
                    
                    // Upload the file
                    await uploadBytes(storageRef, photoFile);
                    
                    // Get the download URL
                    const downloadURL = await getDownloadURL(storageRef);
                    
                    // Update the user's profile with the new photo URL
                    await updateProfile(user, { photoURL: downloadURL });
                    
                    // Update local state
                    setPhotoURL(downloadURL);
                    setPhotoFile(null);
                    
                    console.log("Profile photo updated successfully");
                } catch (error) {
                    console.error("Error uploading profile photo:", error);
                    setMessage({ text: `Error uploading photo: ${error.message}`, type: 'error' });
                    // Continue with other updates even if photo upload fails
                }
            }
            
            // Update email if changed
            if (email !== user.email && currentPassword) {
                const credential = EmailAuthProvider.credential(user.email, currentPassword);
                await reauthenticateWithCredential(user, credential);
                await updateEmail(user, email);
            }
            
            // Update password if provided
            if (newPassword && currentPassword) {
                const credential = EmailAuthProvider.credential(user.email, currentPassword);
                await reauthenticateWithCredential(user, credential);
                await updatePassword(user, newPassword);
                setNewPassword('');
                setCurrentPassword('');
            }
            
            setMessage({ text: 'Profile updated successfully!', type: 'success' });
            
            // Refresh user data
            const updatedUser = auth.currentUser;
            if (updatedUser) {
                setUser(updatedUser);
            }
            
        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage({ text: error.message, type: 'error' });
        } finally {
            setSaving(false);
        }
    };
    
    if (loading) {
        return <div className="loading">Loading profile...</div>;
    }
    
    return (
        <div className={`profile-container ${isDarkTheme ? 'dark' : 'light'}`}>
            <div className="profile-header">
                <h1>Your Profile</h1>
                <p>Manage your personal information and account preferences</p>
            </div>
            
            <div className="profile-content">
                <div className="profile-sidebar">
                    <div 
                        className="profile-photo-container" 
                        onClick={handlePhotoClick}
                        style={photoURL ? { backgroundImage: `url(${photoURL})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                    >
                        {!photoURL && (
                            <div className="profile-photo-placeholder">
                                {displayName ? displayName.charAt(0) : 'U'}
                            </div>
                        )}
                        <div className="photo-edit-overlay">
                            Click to change photo
                        </div>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handlePhotoChange} 
                            style={{ display: 'none' }} 
                            accept="image/*"
                        />
                    </div>
                    
                    <div className="profile-tabs">
                        <button 
                            className={`tab-button ${activeTab === 'general' ? 'active' : ''}`}
                            onClick={() => setActiveTab('general')}
                        >
                            General Information
                        </button>
                        <button 
                            className={`tab-button ${activeTab === 'security' ? 'active' : ''}`}
                            onClick={() => setActiveTab('security')}
                        >
                            Security Settings
                        </button>
                        <button 
                            className={`tab-button ${activeTab === 'preferences' ? 'active' : ''}`}
                            onClick={() => setActiveTab('preferences')}
                        >
                            Preferences
                        </button>
                    </div>
                </div>
                
                <div className="profile-form-container">
                    {message.text && (
                        <div className={`message ${message.type}`}>
                            {message.text}
                        </div>
                    )}
                    
                    <form onSubmit={handleSaveProfile} className="profile-form">
                        {activeTab === 'general' && (
                            <div className="form-section">
                                <h2>General Information</h2>
                                
                                <div className="form-group">
                                    <label htmlFor="displayName">Display Name</label>
                                    <input
                                        id="displayName"
                                        type="text"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        placeholder="Your display name"
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="email">Email Address</label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Your email address"
                                    />
                                    {email !== user.email && (
                                        <p className="field-note">
                                            You'll need to enter your current password to change your email.
                                        </p>
                                    )}
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="bio">Bio</label>
                                    <textarea
                                        id="bio"
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        placeholder="Tell us about yourself"
                                        rows="4"
                                    ></textarea>
                                </div>
                                
                                <div className="form-group">
                                    <label>Interests</label>
                                    <div className="interests-container">
                                        {interests.map((interest, index) => (
                                            <div key={index} className="interest-tag">
                                                <span>{interest}</span>
                                                <button 
                                                    type="button" 
                                                    onClick={() => handleRemoveInterest(interest)}
                                                    className="remove-interest"
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="add-interest">
                                        <input
                                            type="text"
                                            value={newInterest}
                                            onChange={(e) => setNewInterest(e.target.value)}
                                            placeholder="Add an interest"
                                        />
                                        <button 
                                            type="button" 
                                            onClick={handleAddInterest}
                                            className="add-interest-btn"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {activeTab === 'security' && (
                            <div className="form-section">
                                <h2>Security Settings</h2>
                                
                                <div className="form-group">
                                    <label htmlFor="newPassword">New Password</label>
                                    <input
                                        id="newPassword"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Enter new password"
                                    />
                                </div>
                                
                                {(newPassword || email !== user.email) && (
                                    <div className="form-group">
                                        <label htmlFor="currentPassword">Current Password</label>
                                        <input
                                            id="currentPassword"
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            placeholder="Enter current password to confirm changes"
                                            required={newPassword || email !== user.email}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {activeTab === 'preferences' && (
                            <div className="form-section">
                                <h2>Preferences</h2>
                                
                                <div className="form-group">
                                    <label>Theme Preference</label>
                                    <p className="field-note">
                                        You can change your theme using the theme toggle button in the corner of the screen.
                                    </p>
                                </div>
                            </div>
                        )}
                        
                        <div className="form-actions">
                            <button 
                                type="submit" 
                                className="save-button"
                                disabled={saving}
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button 
                                type="button" 
                                className="cancel-button"
                                onClick={() => navigate('/dashboard')}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile; 