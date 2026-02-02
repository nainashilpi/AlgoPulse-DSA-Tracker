import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 
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

// 🔥 PROTECTED ROUTE LOGIC
const ProtectedAdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user && user.role && user.role.toLowerCase() === "admin";

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <ScrollToTop /> 
      
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: {
            background: '#020408',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.05)',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)'
          },
          success: {
            iconTheme: {
              primary: '#06b6d4',
              secondary: '#000',
            },
          },
        }}
      />
      
      <div className="min-h-screen bg-[#020408] selection:bg-cyan-500/30">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/resources" element={<Resources />} />

          {/* 🔥 ADMIN ROUTE NOW PROTECTED */}
          <Route 
            path="/admin" 
            element={
              <ProtectedAdminRoute>
                <Admin />
              </ProtectedAdminRoute>
            } 
          />
          
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;