import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import logo from './logo.png';
import defaultProfilePicture from './defaultProfilePicture.jpg';
import './Feed.css';

const Feed = () => {
  const location = useLocation();
  const isMainFeed = location.pathname === '/feed';
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  const [uploads, setUploads] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const storedUploads = JSON.parse(localStorage.getItem('uploads')) || [];
    setUploads(storedUploads.filter(upload => upload.approved));
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

  const handleLike = (index) => {
    const storedUploads = JSON.parse(localStorage.getItem('uploads')) || [];
    const upload = storedUploads[index];
    if (!upload.likedBy) {
      upload.likedBy = [];
    }
    if (!upload.dislikedBy) {
      upload.dislikedBy = [];
    }

    if (upload.likedBy.includes(loggedInUser.username)) {
      upload.likes -= 1;
      upload.likedBy = upload.likedBy.filter(user => user !== loggedInUser.username);
    } else {
      upload.likes += 1;
      upload.likedBy.push(loggedInUser.username);
      if (upload.dislikedBy.includes(loggedInUser.username)) {
        upload.dislikes -= 1;
        upload.dislikedBy = upload.dislikedBy.filter(user => user !== loggedInUser.username);
      }
    }

    localStorage.setItem('uploads', JSON.stringify(storedUploads));
    setUploads(storedUploads.filter(upload => upload.approved));
  };

  const handleDislike = (index) => {
    const storedUploads = JSON.parse(localStorage.getItem('uploads')) || [];
    const upload = storedUploads[index];
    if (!upload.likedBy) {
      upload.likedBy = [];
    }
    if (!upload.dislikedBy) {
      upload.dislikedBy = [];
    }

    if (upload.dislikedBy.includes(loggedInUser.username)) {
      upload.dislikes -= 1;
      upload.dislikedBy = upload.dislikedBy.filter(user => user !== loggedInUser.username);
    } else {
      upload.dislikes += 1;
      upload.dislikedBy.push(loggedInUser.username);
      if (upload.likedBy.includes(loggedInUser.username)) {
        upload.likes -= 1;
        upload.likedBy = upload.likedBy.filter(user => user !== loggedInUser.username);
      }
    }

    localStorage.setItem('uploads', JSON.stringify(storedUploads));
    setUploads(storedUploads.filter(upload => upload.approved));
  };

  const handleDelete = (index) => {
    const storedUploads = JSON.parse(localStorage.getItem('uploads')) || [];
    storedUploads.splice(index, 1);
    localStorage.setItem('uploads', JSON.stringify(storedUploads));
    setUploads(storedUploads.filter(upload => upload.approved));
  };

  const getUserProfilePicture = (username) => {
    if (username === 'GelaBarkalaia') {
      const adminUser = JSON.parse(localStorage.getItem('loggedInUser'));
      return adminUser.profilePicture;
    }
    const user = users.find(user => user.username === username);
    return user ? user.profilePicture : defaultProfilePicture;
  };

  return (
    <div style={{ display: 'flex' }}>
      <nav className="sidebar">
        <Link to="/feed" style={{ display: 'block', marginBottom: '20px' }}>
          <img src={logo} alt="Logo" />
        </Link>
        <ul>
          <li>
            <Link to="/feed/upload">Upload</Link>
          </li>
          <li>
            <Link to="/feed/statistics">Statistics</Link>
          </li>
          <li>
            <Link to="/feed/profile">Profile</Link>
          </li>
          {loggedInUser.username === 'GelaBarkalaia' && (
            <li>
              <Link to="/feed/approvals">Approvals</Link>
            </li>
          )}
        </ul>
      </nav>
      <main>
        {isMainFeed ? (
          <div>
            <h2 style={{ textAlign: 'center' }}>Feed</h2>
            {uploads.length > 0 ? (
              uploads.map((upload, index) => (
                <div key={index} className="post-container">
                  <div className="post-header">
                    <div className="post-user">
                      <img
                        src={getUserProfilePicture(upload.username)}
                        alt="Profile"
                      />
                      <p className="post-username"><strong>{upload.username}</strong></p>
                    </div>
                    {upload.username === loggedInUser.username && (
                      <button onClick={() => handleDelete(index)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'red' }}>❌</button>
                    )}
                  </div>
                  <div
                    className="post-image"
                    style={{ backgroundImage: `url(${URL.createObjectURL(base64ToBlob(upload.file, upload.file.split(';')[0].split(':')[1]))})` }}
                  ></div>
                  <div className="post-actions">
                    <div className="post-action" onClick={() => handleLike(index)}>👍 {upload.likes || 0}</div>
                    <div className="post-action-divider"></div>
                    <div className="post-action" onClick={() => handleDislike(index)}>👎 {upload.dislikes || 0}</div>
                  </div>
                </div>
              ))
            ) : (
              <p>No approved uploads yet.</p>
            )}
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
};

export default Feed;