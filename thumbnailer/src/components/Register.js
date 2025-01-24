import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import defaultProfilePicture from './defaultProfilePicture.jpg';
import logo from './logo.png';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = () => {
    if (!username || !email || !password) {
      alert('All fields are required');
      return;
    }

    if (!email.includes('@')) {
      alert('Invalid email address');
      return;
    }

    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    if (storedUsers.find(user => user.username === username)) {
      alert('Username already exists');
      return;
    }
    if (storedUsers.find(user => user.email === email)) {
      alert('Email already exists');
      return;
    }

    const newUser = {
      username,
      email,
      password,
      profilePicture: defaultProfilePicture
    };
    storedUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(storedUsers));
    localStorage.setItem('loggedInUser', JSON.stringify(newUser));
    navigate('/feed');
  };

  return (
    <div className="centered-container">
      <div className="centered-form">
        <img src={logo} alt="Logo" />
        <h2>Register</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleRegister}>Register</button>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;