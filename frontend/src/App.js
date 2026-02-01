import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; 
import ScrollToTop from './components/ScrollToTop';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import Admin from './pages/Admin';
import Resources from './pages/Resources';
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <ScrollToTop /> 
      
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: {
            background: '#0a0f1a',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            fontSize: '12px',
            fontFamily: 'sans-serif',
            borderRadius: '12px'
          },
          success: {
            iconTheme: {
              primary: '#22d3ee',
              secondary: '#000',
            },
          },
        }}
      />
      
      <div className="min-h-screen bg-[#05070a]">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/resources" element={<Resources />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;