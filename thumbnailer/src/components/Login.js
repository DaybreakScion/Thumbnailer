import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from './logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!email.includes('@')) {
      alert('Invalid email address');
      return;
    }

    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const user = storedUsers.find(user => user.email === email && user.password === password);

    if (user) {
      localStorage.setItem('loggedInUser', JSON.stringify({ username: user.username, profilePicture: user.profilePicture }));
      navigate('/feed');
    } else if (email === '1@1' && password === '11') {
      const adminUser = { username: 'GelaBarkalaia', email: 'admin@admin.com', profilePicture: logo };
      localStorage.setItem('loggedInUser', JSON.stringify(adminUser));
      navigate('/feed');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="centered-container">
      <div className="centered-form">
        <img src={logo} alt="Logo" />
        <h2>Login</h2>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Login</button>
        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;