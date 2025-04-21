import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar'; 
import { Card, Spinner, Button, Modal } from 'react-bootstrap';
import Footer from '../components/Footer';
import { FaUserEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';

const Profile = () => {
  useEffect(() => {
    document.title = 'Profile | DUTU';
  }, []);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [updatedName, setUpdatedName] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Get user data from localStorage
  const token = localStorage.getItem('authToken');
  const userName = localStorage.getItem('userName'); 
  const userEmail = localStorage.getItem('userEmail'); 
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!token) {
      navigate('/');
    } else {
      setLoading(false);
      setUpdatedName(userName);
    }
  }, [token, navigate, userName]);
  
  const handleSave = async () => {
    try {
      const response = await axios.put(
        `https://dutu-app-api.vercel.app/api/auth/update/${userId}`,
        { name: updatedName },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      localStorage.setItem('userName', response.data.name);
      setEditMode(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Update error:', error);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
  
    try {
      await axios.delete(`https://dutu-app-api.vercel.app/api/auth/delete/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      toast.success('Account deleted successfully');
      localStorage.clear();
      navigate('/');
    } catch (error) {
      toast.error('Failed to delete account');
      console.error('Delete error:', error);
    } finally {
      setDeleting(false);
    }
  };
  

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  const getRandomColor = () => {
    const colors = [
      '#3498db', '#2ecc71', '#e74c3c', '#f39c12', 
      '#9b59b6', '#1abc9c', '#d35400', '#34495e'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
        <Spinner 
          animation="border" 
          variant="primary" 
          style={{ width: '3rem', height: '3rem' }}
        />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100 bg-dark text-light">
      <NavBar />
      
      {/* Profile Content */}
      <div className="flex-grow-1 d-flex align-items-center justify-content-center py-5">
        <Card className="border-0 shadow-lg" style={{ 
          width: '22rem', 
          backgroundColor: '#1e1e1e',
          borderRadius: '15px'
        }}>
          {/* Profile Picture */}
          <div className="d-flex justify-content-center mt-4">
            <div
              className="d-flex justify-content-center align-items-center rounded-circle shadow"
              style={{
                width: '120px',
                height: '120px',
                backgroundColor: getRandomColor(),
                color: '#fff',
                fontSize: '3rem',
                fontWeight: 'bold',
                border: '3px solid #0d6efd'
              }}
            >
              {getInitials(userName)}
            </div>
          </div>

          {/* Profile Content */}
          <Card.Body className="text-center px-4">
            {editMode ? (
              <div className="mb-3">
                <input
                  type="text"
                  value={updatedName}
                  onChange={(e) => setUpdatedName(e.target.value)}
                  className="form-control bg-dark text-light border-secondary text-center mb-2"
                  style={{ fontSize: '1.25rem' }}
                />
                <div className="d-flex justify-content-center gap-2">
                  <Button 
                    variant="success" 
                    size="sm"
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Card.Title className="mb-3 text-light" style={{ fontSize: '1.5rem' }}>
                {userName}
                <Button 
                  variant="link" 
                  className="text-primary p-0 ms-2"
                  onClick={() => setEditMode(true)}
                >
                  <FaUserEdit size={18} />
                </Button>
              </Card.Title>
            )}
            
            <Card.Text className="text-light mb-4">
              <span className="d-block">{userEmail}</span>
              <small className="text-light">Member since {new Date().toLocaleDateString()}</small>
            </Card.Text>

            <div className="d-flex flex-column gap-2">
              <Button 
                variant="outline-danger" 
                className="d-flex align-items-center justify-content-center gap-2"
                onClick={() => setShowDeleteModal(true)}
              >
                <FaTrash /> Delete Account
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Delete Account Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="bg-dark text-light">
          <Modal.Title>Confirm Account Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light">
          <p>Are you sure you want to delete your account? This action cannot be undone.</p>
          <p>All your data will be permanently removed.</p>
        </Modal.Body>
        <Modal.Footer className="bg-dark">
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteAccount} disabled={deleting}>
            {deleting ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                {' Deleting...'}
              </>
            ) : (
              'Delete Account'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />

      {/* Custom CSS */}
      <style>{`
        .card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3) !important;
        }
        .form-control.bg-dark:focus {
          background-color: #1e1e1e;
          border-color: #0d6efd;
          color: white;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
        }
      `}</style>
    </div>
  );
};

export default Profile;