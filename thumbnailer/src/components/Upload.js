import React, { useState } from 'react';
import './Upload.css';
import uploadIcon from './pngegg.png';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    validateFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const selectedFile = e.dataTransfer.files[0];
    validateFile(selectedFile);
  };

  const validateFile = (file) => {
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Unsupported file type. Please upload a JPG, PNG, or GIF image.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('File size exceeds 2MB.');
      return;
    }
    const img = new Image();
    img.onload = () => {
      if (img.width !== 1280 || img.height !== 720) {
        setError('Image dimensions must be 1280x720 pixels.');
      } else {
        setFile(file);
        setError('');
      }
    };
    img.src = URL.createObjectURL(file);
  };

  const handleUpload = () => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result;
      const storedUploads = JSON.parse(localStorage.getItem('uploads')) || [];
      const isAdmin = loggedInUser.username === 'GelaBarkalaia';
      storedUploads.push({ file: base64data, approved: isAdmin, username: loggedInUser.username, likes: 0, dislikes: 0, likedBy: [], dislikedBy: [] });
      localStorage.setItem('uploads', JSON.stringify(storedUploads));
      alert('Upload successful.' + (isAdmin ? ' Your upload is automatically approved.' : ' Awaiting admin approval.'));
      setFile(null);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      className="upload-container"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className="upload-icon" style={{ backgroundImage: `url(${uploadIcon})` }}></div>
      <p className="upload-text">Drag and Drop here</p>
      <div className="upload-or">or</div>
      <div className="upload-button-container">
        <input type="file" onChange={handleFileChange} style={{ display: 'none' }} id="file-upload" />
        <label htmlFor="file-upload" className="upload-button">Select file</label>
      </div>
      {file && <p>Selected file: {file.name}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleUpload} disabled={!file} className="upload-button">Upload</button>
    </div>
  );
};

export default Upload;