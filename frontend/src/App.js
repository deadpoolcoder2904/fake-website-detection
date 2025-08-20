import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './landing pages/Navbar';
import HomePage from './landing pages/HomePage/HomePage';
import Login from './landing pages/Login/Login';
import Register from './landing pages/Login/Register';
import ReportURL from './landing pages/ReportURL/ReportURL';
import ReportedURLs from './landing pages/ReportedURLs/ReportedURLs';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/report" element={<ReportURL />} />
            <Route path="/reported-urls" element={<ReportedURLs />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 