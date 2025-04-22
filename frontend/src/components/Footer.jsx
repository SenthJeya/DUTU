import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 border-top border-secondary position-fixed bottom-0 start-0 w-100 pb-5">
      <Container>
        <Row className="g-3 align-items-center">
          <Col md={4} className="order-1 order-md-1 text-center text-md-start">
            <div className="d-flex align-items-center justify-content-center justify-content-md-start">
              <img 
              src="/logo.png"  
              alt="DUTU Logo"
              style={{
                height: '24px',
                width: '24px',
                marginRight: '10px',
                objectFit: 'contain'
              }}
            />
              <div>
                <span className="fw-bold fs-5 text-warning">DUTU</span>
                <span className="ms-2 small text-info d-none d-sm-inline">Task Manager</span>
              </div>
            </div>
          </Col>

          <Col xs={12} md={4} className="order-3 order-md-2 text-center">
            <div className="d-flex flex-column">
              <small className="text-white">
                &copy; {new Date().getFullYear()} DUTU App. All rights reserved.
              </small>
              <small className="text-light mt-1">
                Developed by Senthuran Jeiyachandiran
              </small>
            </div>
          </Col>

          <Col md={4} className="order-2 order-md-3 text-center text-md-end">
            <div className="d-flex justify-content-center justify-content-md-end gap-3">
              <a href="https://github.com/SenthJeya" className="social-icon" aria-label="GitHub">
                <FaGithub size={20} />
              </a>
              <a href="https://www.linkedin.com/in/senthuran-jeiyachandiran" className="social-icon" aria-label="LinkedIn">
                <FaLinkedin size={20} />
              </a>
              <a href="https://www.instagram.com/ramana._.gaming?igsh=MXF6eGlybWk5YXIzcA==" className="social-icon" aria-label="Instagram">
                <FaInstagram size={20} />
              </a>
            </div>
          </Col>
        </Row>
      </Container>

      <style>{`
        .gradient-text {
          background: linear-gradient(90deg, #0d6efd, #00b4ff);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .social-icon {
          color: white;
          transition: all 0.3s ease;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }
        .social-icon:hover {
          color: #0d6efd;
          transform: translateY(-3px) scale(1.1);
          background-color: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </footer>
  );
};

export default Footer;