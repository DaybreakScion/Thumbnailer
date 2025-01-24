import React, { useState, useEffect } from 'react';
import defaultProfilePicture from './defaultProfilePicture.jpg';

const Approvals = () => {
  const [uploads, setUploads] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const storedUploads = JSON.parse(localStorage.getItem('uploads')) || [];
    setUploads(storedUploads.filter(upload => !upload.approved));
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    setUsers(storedUsers.map(user => ({
      ...user,
      profilePicture: user.profilePicture || defaultProfilePicture
    })));
  }, []);

  const handleApprove = (index) => {
    const storedUploads = JSON.parse(localStorage.getItem('uploads')) || [];
    const uploadIndex = storedUploads.findIndex(upload => upload.file === uploads[index].file);
    if (uploadIndex !== -1) {
      storedUploads[uploadIndex].approved = true;
      localStorage.setItem('uploads', JSON.stringify(storedUploads));
      setUploads(storedUploads.filter(upload => !upload.approved));
    }
  };

  const handleDisapprove = (index) => {
    const storedUploads = JSON.parse(localStorage.getItem('uploads')) || [];
    const uploadIndex = storedUploads.findIndex(upload => upload.file === uploads[index].file);
    if (uploadIndex !== -1) {
      storedUploads.splice(uploadIndex, 1);
      localStorage.setItem('uploads', JSON.stringify(storedUploads));
      setUploads(storedUploads.filter(upload => !upload.approved));
    }
  };

  const getUserProfilePicture = (username) => {
    const user = users.find(user => user.username === username);
    return user ? user.profilePicture : defaultProfilePicture;
  };

  return (
    <main>
      {uploads.length > 0 ? (
        uploads.map((upload, index) => (
          <div key={index} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={getUserProfilePicture(upload.username)}
                alt="Profile"
                style={{ borderRadius: '50%', width: '40px', height: '40px', marginRight: '10px' }}
              />
              <p><strong>{upload.username}</strong></p>
            </div>
            <img
              src={upload.file}
              alt="Thumbnail"
              style={{ width: '100%', maxWidth: '1280px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
              <button onClick={() => handleApprove(index)} style={{ marginRight: '10px' }}>✔️</button>
              <button onClick={() => handleDisapprove(index)}>❌</button>
            </div>
          </div>
        ))
      ) : (
        <p>No pending uploads.</p>
      )}
    </main>
  );
};

export default Approvals;