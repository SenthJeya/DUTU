import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaUserPlus, FaSignInAlt } from 'react-icons/fa';
import Footer from '../components/Footer';

const SignUp = () => {
  useEffect(() => {
    document.title = 'SignUp | DUTU';
  }, []);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateFields = () => {
    if (!email.trim()) {
      toast.error("Email is required.");
      return false;
    }
    if (!password.trim()) {
      toast.error("Password is required.");
      return false;
    }
    if (!confirmPassword.trim()) {
      toast.error("Confirm password is required.");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return false;
    }

    return true;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateFields()) {
      setLoading(false);
      return;
    }
  
  
    try {
      const response = await axios.post('https://dutu-app-api.vercel.app/auth/register', { 
        name, 
        email, 
        password 
      });
      
      localStorage.setItem('authToken', response.data.token);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      setLoading(false);
      toast.error(errorMessage);
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
              style={{ 
                height: '40px', 
                width: '40px',
                filter: 'drop-shadow(0 0 4px rgba(13, 110, 253, 0.5))'
              }}
            />
            <h1 className="text-light mb-0">
              <span className="fw-bold text-warning">DUTU</span>
              <span className="text-info ms-2 small">Task Manager</span>
            </h1>
          </div>
        </div>

        {/* Sign Up Form */}
        <form
          onSubmit={handleSignUp}
          className="p-4 bg-dark-2 rounded-3 shadow-lg border border-dark"
        >
          <h2 className="text-center mb-4 text-light">
            <FaUserPlus className="me-2" />
            Create Account
          </h2>
          
          <div className="mb-3">
            <label htmlFor="name" className="form-label text-light">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control input-dark"
              //required
              placeholder="Enter your full name"
            />
          </div>
          
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
          
          <div className="mb-3">
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
              placeholder="Create a password"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="form-label text-light">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-control input-dark"
              //required
              placeholder="Confirm your password"
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary w-100 py-2 fw-bold"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"} 
          </button>
          
          <div className="d-flex align-items-center justify-content-center mt-3">
            <hr className="flex-grow-1 border-light" />
            <span className="px-3 text-light small">OR</span>
            <hr className="flex-grow-1 border-light" />
          </div>
          
          <p className="text-center mt-3 text-light">
            Already have an account?{' '}
            <button 
              type="button"
              className="btn btn-link text-decoration-none p-0"
              onClick={() => navigate('/')}
            >
              <span className="text-primary">
                <FaSignInAlt className="me-1" />
                Sign In
              </span>
            </button>
          </p>
        </form>
        <Footer />
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

export default SignUp;
