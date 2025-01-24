import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import defaultProfilePicture from './defaultProfilePicture.jpg';

const Profile = () => {
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(loggedInUser.profilePicture || defaultProfilePicture);
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const navigate = useNavigate();

  const handleChangePassword = () => {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = storedUsers.findIndex(user => user.username === loggedInUser.username);

    if (userIndex !== -1 && storedUsers[userIndex].password === password) {
      storedUsers[userIndex].password = newPassword;
      localStorage.setItem('users', JSON.stringify(storedUsers));
      alert('Password changed successfully');
    } else {
      alert('Current password is incorrect');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    navigate('/login');
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result;
        setNewProfilePicture(base64data);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfilePicture = () => {
    if (newProfilePicture) {
      setProfilePicture(newProfilePicture);
      const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
      const userIndex = storedUsers.findIndex(user => user.username === loggedInUser.username);
      if (userIndex !== -1) {
        storedUsers[userIndex].profilePicture = newProfilePicture;
        localStorage.setItem('users', JSON.stringify(storedUsers));
        localStorage.setItem('loggedInUser', JSON.stringify({ ...loggedInUser, profilePicture: newProfilePicture }));
        alert('Profile picture updated successfully');
      }
    }
  };

  return (
      <div className="centered-form">
        <img src={profilePicture} alt="Profile" style={{ borderRadius: '50%', width: '100px', height: '100px' }} />
        <h2>Profile</h2>
        <p>Username: {loggedInUser.username}</p>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input type="file" onChange={handleProfilePictureChange} />
          {newProfilePicture && <button onClick={handleSaveProfilePicture} style={{ marginLeft: '10px' }}>Save</button>}
        </div>
        <input
          type="password"
          placeholder="Current Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button onClick={handleChangePassword}>Change Password</button>
        <button onClick={handleLogout} style={{ marginTop: '10px' }}>Logout</button>
      </div>
  );
};

export default Profile;