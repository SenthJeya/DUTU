import { Modal, Button } from 'react-bootstrap';
import { FaExclamationTriangle } from 'react-icons/fa';

const TokenExpire = ({ onConfirm }) => {
  return (
    <Modal
      show={true}
      onHide={onConfirm}
      centered
      backdrop="static"
      keyboard={false}
      contentClassName="dark-theme-modal-content"
    >
      <Modal.Header className="bg-dark-2 border-secondary">
        <Modal.Title className="text-danger d-flex align-items-center">
          <FaExclamationTriangle className="me-2" />
          Session Expired
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="bg-dark-3 text-light">
        <div className="d-flex align-items-center">
          <div className="flex-grow-1">
            <p className="mb-0">Your session has expired. Please log in again.</p>
          </div>
        </div>
      </Modal.Body>
      
      <Modal.Footer className="bg-dark-2 border-secondary">
        <Button 
          variant="primary" 
          onClick={onConfirm}
          className="px-4 py-2 fw-bold"
        >
          Return to Login
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

// Add this to your CSS file or style tag
const styles = `
  .dark-theme-modal-content {
    background-color: #1a1a1a;
    color: #fff;
    border: 1px solid #444;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  }
  .bg-dark-2 {
    background-color: #1a1a1a;
  }
  .bg-dark-3 {
    background-color: #252525;
  }
  .btn-primary {
    background-color: #0d6efd;
    border: none;
    transition: all 0.3s ease;
  }
  .btn-primary:hover {
    background-color: #0b5ed7;
    transform: translateY(-1px);
  }
  .text-danger {
    color: #dc3545 !important;
  }
`;

// Add styles to the head
const styleElement = document.createElement('style');
styleElement.innerHTML = styles;
document.head.appendChild(styleElement);

export default TokenExpire;