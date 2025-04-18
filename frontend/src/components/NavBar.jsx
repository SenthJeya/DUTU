import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FaHome, FaUser, FaSignOutAlt } from 'react-icons/fa';


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
      <Container fluid="lg">
        <Navbar.Brand className="d-flex align-items-center gap-3">
          <div className="d-flex align-items-center">
            <img 
              src="/logo.png"  
              alt="DUTU Logo"
              style={{
                height: '30px',
                width: '30px',
                marginRight: '10px',
                objectFit: 'contain'
              }}
            />
            <h1 className="text-warning mb-0" style={{
              fontSize: '28px',
              fontWeight: '700',
              letterSpacing: '1px',
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
            }}>
              DUTU
            </h1>
            <span className="ms-2 text-info small" style={{
              letterSpacing: '0.5px',
              alignSelf: 'flex-end',
              marginBottom: '3px'
            }}>
              Task Manager
            </span>
          </div>

          {username && (
            <div className="text-light ms-3 ps-3 border-start border-secondary">
              <span className="opacity-75">Welcome, </span>
              <span className="fw-semibold text-warning">{username}</span>
            </div>
          )}
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0" />
        <Navbar.Collapse id="basic-navbar-nav">
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
        .gradient-text {
          background: linear-gradient(90deg, #0d6efd, #00b4ff);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .nav-link-hover {
          transition: all 0.3s ease;
          padding: 0.5rem 1rem;
          border-radius: 0.25rem;
          margin: 0 0.25rem;
        }
        .nav-link-hover:hover {
          background-color: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }
        .nav-link-hover.active {
          background-color: rgba(13, 110, 253, 0.2);
          border-bottom: 2px solid #0d6efd;
        }
      `}</style>
    </Navbar>
  );
};

export default NavBar;