import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Feed from './components/Feed';
import Upload from './components/Upload';
import Statistics from './components/Statistics';
import Profile from './components/Profile';
import Approvals from './components/Approvals';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/feed" element={<Feed />}>
          <Route path="upload" element={<Upload />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="profile" element={<Profile />} />
          <Route path="approvals" element={<Approvals />} />
        </Route>
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;