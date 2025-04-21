import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FaHome, FaUser, FaSignOutAlt, FaBars } from 'react-icons/fa';

const NavBar = () => {
  const username = localStorage.getItem('userName');
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('username');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user');
    localStorage.removeItem('authToken'); 
    navigate('/');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="border-bottom border-secondary">
      <Container fluid>
        <Navbar.Brand className="d-flex align-items-center">
          <div className="d-flex align-items-center flex-wrap">
            <div className="d-flex align-items-center me-2">
              <img 
                src="/logo.png"  
                alt="DUTU Logo"
                className="navbar-logo"
              />
              <h1 className="text-warning mb-0 navbar-brand-text">
                DUTU
              </h1>
            </div>
            <span className="text-info small navbar-subtext">
              Task Manager
            </span>
          </div>

          {username && (
            <div className="text-light username-display d-none d-lg-block">
              <span className="opacity-75">Welcome, </span>
              <span className="fw-semibold text-warning">{username}</span>
            </div>
          )}
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0">
          <FaBars className="text-white" />
        </Navbar.Toggle>
        
        <Navbar.Collapse id="basic-navbar-nav">
          {username && (
            <div className="text-light d-lg-none text-center my-2">
              <span className="opacity-75">Welcome, </span>
              <span className="fw-semibold text-warning">{username}</span>
            </div>
          )}
          
          <Nav className="ms-auto align-items-center">
            <Nav.Link
              as={Link}
              to="/dashboard"
              className={`nav-link-hover ${location.pathname === '/dashboard' ? 'active' : ''}`}
            >
              <FaHome className="me-1" /> Home
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/profile"
              className={`nav-link-hover ${location.pathname === '/profile' ? 'active' : ''}`}
            >
              <FaUser className="me-1" /> Profile
            </Nav.Link>

            <Nav.Link 
              onClick={handleLogout}
              className="nav-link-hover text-danger"
            >
              <FaSignOutAlt className="me-1" /> Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>

      <style>{`
        .navbar-logo {
          height: 30px;
          width: 30px;
          margin-right: 10px;
          object-fit: contain;
        }
        
        .navbar-brand-text {
          font-size: 28px;
          font-weight: 700;
          letter-spacing: 1px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .navbar-subtext {
          letter-spacing: 0.5px;
          align-self: flex-end;
          margin-bottom: 3px;
        }
        
        .username-display {
          margin-left: 1rem;
          padding-left: 1rem;
          border-left: 1px solid #6c757d;
        }
        
        .gradient-text {
          background: linear-gradient(90deg, #0d6efd, #00b4ff);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        /* Increased tab width styles */
        .nav-link-hover {
          transition: all 0.3s ease;
          padding: 0.75rem 1.5rem; /* Increased padding for wider tabs */
          border-radius: 0.25rem;
          margin: 0 0.5rem; /* Increased margin between tabs */
          text-align: center;
          min-width: 120px; /* Minimum width for each tab */
        }
        
        .nav-link-hover:hover {
          background-color: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }
        
        .nav-link-hover.active {
          background-color: rgba(13, 110, 253, 0.2);
          border-bottom: 2px solid #0d6efd;
        }
        
        /* Responsive adjustments */
        @media (max-width: 992px) {
          .navbar-brand-text {
            font-size: 24px;
          }
          
          .navbar-subtext {
            font-size: 0.65rem;
          }
          
          .nav-link-hover {
            padding: 0.75rem 1rem;
            min-width: 100px;
          }
        }
        
        @media (max-width: 768px) {
          .navbar-collapse {
            padding: 1rem;
            background-color: rgba(33, 37, 41, 0.98);
            border-radius: 0.25rem;
            margin-top: 0.5rem;
          }
          
          .nav-link-hover {
            margin: 0.5rem 0;
            padding: 0.75rem;
            min-width: auto;
            width: 100%;
            display: block;
          }
          
          .navbar-brand {
            flex-direction: column;
            align-items: flex-start;
          }
        }
        
        @media (max-width: 576px) {
          .navbar-brand-text {
            font-size: 20px;
          }
          
          .navbar-logo {
            height: 25px;
            width: 25px;
          }
        }
      `}</style>
    </Navbar>
  );
};

export default NavBar;