import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // For any global styles

// Components
import SignIn from './auth/SignIn';
import SignUp from './auth/SignUp';  
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import TokenExpire from "./components/TokenExpire";

function App() {
  return (
    <Router>
      <TokenExpirationHandler />
      <ToastContainer 
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        toastClassName="dark-toast"
      />
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

const TokenExpirationHandler = () => {
  const [isTokenExpired, setIsTokenExpired] = useState(false);
  const navigate = useNavigate();

  const checkTokenExpiration = () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp * 1000 < Date.now()) {
        setIsTokenExpired(true);
        // Clear all auth-related data
        localStorage.removeItem("authToken");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
      }
    } catch (error) {
      console.error("Token validation error:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(checkTokenExpiration, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    setIsTokenExpired(false);
    toast.error("Session expired. Please log in again.");
    navigate("/");
  };

  return isTokenExpired ? (
    <TokenExpire
      title="Session Expired"
      message="Your session has expired. Please log in again to continue."
      onConfirm={handleLogout}
    />
  ) : null;
};

export default App;