import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaSignInAlt, FaUserPlus } from 'react-icons/fa';

const SignIn = () => {
  useEffect(() => {
    document.title = 'SignIn | DUTU';
  }, []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const validateFields = () => {
    if (!email.trim()) {
      toast.error("Email is required.");
      return false;
    }
    if (!password.trim()) {
      toast.error("Password is required.");
      return false;
    }
    
    return true;
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateFields()) {
      setLoading(false); // Re-enable button if validation fails
      return;
    }
  
    try {
      const response = await axios.post('https://dutu-app-api.vercel.app/api/auth/login', {
        email,
        password,
      });
  
      const { token, user } = response.data;
  
      if (!token) {
        throw new Error('Token is missing in the response');
      }
  
      localStorage.setItem('authToken', token);
      localStorage.setItem('userName', user.name);
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userId', user.id);
  
      toast.success('Login successful!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      setLoading(false);
      toast.error(errorMessage);
      console.error('Sign-in error:', error);
    }
  };
  
  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-dark">
      <div className="w-100" style={{ maxWidth: '450px' }}>
        {/* Logo and App Name Header */}
        <div className="text-center mb-4">
          <div className="d-flex align-items-center justify-content-center mb-3">
            <img 
              src="/logo.png" 
              alt="DUTU Logo" 
              className="me-2" 
              style={{ height: '40px', width: '40px' }}
            />
            <h1 className="text-light mb-0">
              <span className="fw-bold text-warning">DUTU</span>
              <span className="text-info ms-2 small">Task Manager</span>
            </h1>
          </div>
        </div>

        {/* Sign In Form */}
        <form
          onSubmit={handleSignIn}
          className="p-4 bg-dark-2 rounded-3 shadow-lg border border-dark"
        >
          <h2 className="text-center mb-4 text-light">
            <FaSignInAlt className="me-2" />
            Sign In
          </h2>
          
          <div className="mb-3">
            <label htmlFor="email" className="form-label text-light">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control input-dark"
              //required
              placeholder="Enter your email"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="password" className="form-label text-light">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control input-dark"
              //required
              placeholder="Enter your password"
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary w-100 py-2 fw-bold"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
          
          <div className="d-flex align-items-center justify-content-center mt-3">
            <hr className="flex-grow-1 border-light" />
            <span className="px-3 text-light small">OR</span>
            <hr className="flex-grow-1 border-light" />
          </div>
          
          <p className="text-center mt-3 text-white">
            Don't have an account?{' '}
            <button 
              type="button"
              className="btn btn-link text-decoration-none p-0"
              onClick={() => navigate('/signup')}
            >
              <span className="text-primary">
                <FaUserPlus className="me-1" />
                Sign Up
              </span>
            </button>
          </p>
        </form>
      </div>

      {/* Custom CSS for all form fields */}
      <style>{`
        .bg-dark-2 {
          background-color: #1a1a1a;
        }
        
        /* Base input styling */
        .input-dark {
          background-color: #212529 !important;
          border: 1px solid #495057 !important;
          color: #ffffff !important;
          transition: all 0.3s ease;
          padding: 0.5rem 1rem;
          border-radius: 0.25rem;
          width: 100%;
        }
        
        /* Focus state */
        .input-dark:focus {
          background-color: #1a1a1a !important;
          border-color: #4a4a4a !important;
          color: white !important;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25) !important;
          outline: none;
        }
        
        /* Placeholder text */
        .input-dark::placeholder {
          color: #6c757d !important;
          opacity: 1 !important;
        }
        
        /* Autofill styling for all browsers */
        .input-dark:-webkit-autofill,
        .input-dark:-webkit-autofill:hover, 
        .input-dark:-webkit-autofill:focus,
        .input-dark:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px #212529 inset !important;
          -webkit-text-fill-color: #ffffff !important;
          caret-color: #ffffff;
          transition: background-color 5000s ease-in-out 0s;
        }
        
        /* Firefox */
        .input-dark:-moz-autofill,
        .input-dark:-moz-autofill:hover,
        .input-dark:-moz-autofill:focus {
          background-color: #212529 !important;
          color: #ffffff !important;
        }
        
        /* Edge */
        .input-dark:-ms-input-autofill {
          background-color: #212529 !important;
          color: #ffffff !important;
        }
        
        /* Button styling */
        .btn-primary {
          background-color: #0d6efd;
          border-color: #0d6efd;
        }
        .btn-primary:hover {
          background-color: #0b5ed7;
          border-color: #0a58ca;
        }
      `}</style>
    </div>
  );
};

export default SignIn;
