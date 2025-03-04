import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Homepage from './components/Homepage';
import Login from './components/Login';
import ThemeToggle from './components/ThemeToggle';
import AboutUs from './components/AboutUs';
import Help from './components/Help';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/help" element={<Help />} />
            <Route path="/login" element={<Login />} />
          </Routes>
          <ThemeToggle />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
