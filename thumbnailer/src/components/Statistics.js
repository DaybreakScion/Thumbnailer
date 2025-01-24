import React, { useState, useEffect } from 'react';
import defaultProfilePicture from './defaultProfilePicture.jpg';

const Statistics = () => {
  const [uploads, setUploads] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const storedUploads = JSON.parse(localStorage.getItem('uploads')) || [];
    const approvedUploads = storedUploads.filter(upload => upload.approved);
    const sortedUploads = approvedUploads.sort((a, b) => (b.likes - b.dislikes) - (a.likes - a.dislikes));
    setUploads(sortedUploads);
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    setUsers(storedUsers.map(user => ({
      ...user,
      profilePicture: user.profilePicture || defaultProfilePicture
    })));
  }, []);

  const base64ToBlob = (base64, type) => {
    const binary = atob(base64.split(',')[1]);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type });
  };

  const getUserProfilePicture = (username) => {
    const user = users.find(user => user.username === username);
    return user ? user.profilePicture : defaultProfilePicture;
  };

  return (
    <main>
      <h2>Statistics</h2>
      {uploads.length > 0 ? (
        uploads.map((upload, index) => (
          <div key={index} className="post">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={getUserProfilePicture(upload.username)}
                alt="Profile"
                style={{ borderRadius: '50%', width: '40px', height: '40px', marginRight: '10px' }}
              />
              <p><strong>{upload.username}</strong></p>
            </div>
            <img
              src={URL.createObjectURL(base64ToBlob(upload.file, upload.file.split(';')[0].split(':')[1]))}
              alt="Thumbnail"
              style={{ width: '100%', maxWidth: '1280px' }}
            />
            <p>👍 {upload.likes}</p>
            <p>👎 {upload.dislikes}</p>
            <p>Reputation: {upload.likes - upload.dislikes}</p>
          </div>
        ))
      ) : (
        <p>No approved uploads yet.</p>
      )}
    </main>
  );
};

export default Statistics;