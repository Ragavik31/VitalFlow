import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import Donors from './components/Donors';
import Receiver from './components/Receiver';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Privacy from './components/Privacy';
import Map from './components/MapSearch';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUsername = localStorage.getItem('username');
    if (token && storedUsername) {
      setIsAuthenticated(true);
      setUsername(storedUsername);
    }
  }, []);

  return (
    <div className="App">
      <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path="/" element={<Home username={username} />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route 
          path="/donors" 
          element={isAuthenticated ? <Donors /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/receiver" 
          element={isAuthenticated ? <Receiver /> : <Navigate to="/login" />} 
        />
        <Route path="/privacy" element={<Privacy />} />
        <Route 
          path="/login" 
          element={<Login setIsAuthenticated={setIsAuthenticated} setUsername={setUsername} />} 
        />
        <Route path="/signup" element={<Signup />} />
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
        />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/map" element={<Map />} />
      </Routes>
    </div>
  );
}

export default App;