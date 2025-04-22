import React, { useEffect, useState } from 'react';
import { Container, Button, Form, ListGroup, Modal, Card, Spinner } from 'react-bootstrap';
import axios from 'axios';
import NavBar from '../components/NavBar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../components/Footer';
import { FaPlus, FaEdit, FaTrash, FaCheck } from 'react-icons/fa';

const Dashboard = () => {
  useEffect(() => {
    document.title = 'Home | DUTU';
  }, []);

  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [error, setError] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!token) {
          throw new Error('No token found. Please login.');
        }
  
        const response = await axios.get('https://dutu-app-api.vercel.app/task/get', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        setTasks(response.data); // Use the server-sorted data directly
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setError(error.response?.data?.message || error.message || 'Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    };
  
    fetchTasks();
}, [token]);

  const handleTaskCompletion = async (task) => {
    try {
      const updatedCompleted = !task.completed;
      await axios.put(
        `https://dutu-app-api.vercel.app/task/update/${task._id}`,
        { completed: updatedCompleted },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // Update and sort tasks
      setTasks(prevTasks => {
        const updatedTasks = prevTasks.map(t =>
          t._id === task._id ? { ...t, completed: updatedCompleted } : t
        );
        
        // Sort tasks: incomplete first, then completed, newest first
        return updatedTasks.sort((a, b) => {
          if (a.completed !== b.completed) {
            return a.completed ? 1 : -1; // Incomplete tasks first
          }
          return new Date(b.createdAt) - new Date(a.createdAt); // Newest first
        });
      });
  
      toast.success(`Task marked as ${updatedCompleted ? 'completed' : 'incomplete'}`);
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error(error.response?.data?.message || 'Failed to update task');
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!taskName.trim()) {
      toast.warning('Task name cannot be empty');
      return;
    }

    try {
      await axios.post(
        'https://dutu-app-api.vercel.app/task/create',
        { name: taskName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh tasks after adding
      const response = await axios.get('https://dutu-app-api.vercel.app/task/get', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTasks(response.data);
      setTaskName('');
      toast.success('Task added successfully!');
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error(error.response?.data?.message || 'Failed to add task');
    }
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;

    try {
      await axios.delete(
        `https://dutu-app-api.vercel.app/task/delete/${taskToDelete._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTasks(prevTasks => prevTasks.filter(task => task._id !== taskToDelete._id));
      setShowModal(false);
      toast.success('Task deleted successfully!');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error(error.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleSaveEditedTask = async () => {
    if (!editingTask || !taskName.trim()) {
      toast.warning('Task name cannot be empty');
      return;
    }
  
    try {
      await axios.put(
        `https://dutu-app-api.vercel.app/task/edit/${editingTask._id}`,
        { name: taskName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // Update task in state
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task._id === editingTask._id ? { ...task, name: taskName } : task
        )
      );
  
      setShowEditModal(false);
      setEditingTask(null);
      setTaskName('');
      toast.success('Task updated successfully!');
    } catch (error) {
      console.error('Error editing task:', error);
      toast.error(error.response?.data?.message || 'Failed to edit task');
    }
  };
  
  return (
    <div className="d-flex flex-column min-vh-100 bg-dark text-light">
      <NavBar />

      <Container className="flex-grow-1 py-4">
        <h2 className="mb-4 text-success fw-bold">
          <FaCheck className="me-2" />
          My Tasks
        </h2>
        
        {/* Add Task Form */}
        <Card className="mb-4 border-secondary bg-dark-2">
          <Card.Body>
            <Form onSubmit={handleAddTask}>
              <Form.Group controlId="taskName">
                <Form.Label className="text-light">Add New Task</Form.Label>
                <div className="d-flex">
                  <Form.Control
                    type="text"
                    placeholder="Enter task name"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    className="bg-dark text-light border-secondary"
                  />
                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="ms-2 d-flex align-items-center"
                  >
                    <FaPlus className="me-1" /> Add
                  </Button>
                </div>
              </Form.Group>
            </Form>
          </Card.Body>
        </Card>

        {/* Tasks List */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-3 text-light">Loading tasks...</p>
          </div>
        ) : error ? (
          <Card className="text-center border-danger bg-dark-2">
            <Card.Body>
              <Card.Text className="text-danger">
                Error: {error}
              </Card.Text>
              <Button variant="outline-danger" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </Card.Body>
          </Card>
        ) : tasks.length === 0 ? (
          <Card className="text-center border-secondary bg-dark-2">
            <Card.Body>
              <Card.Text className="text-light">
                No tasks found. Start by adding a new task above!
              </Card.Text>
            </Card.Body>
          </Card>
        ) : (
          <ListGroup className="border-secondary">
            {tasks.map((task) => (
              <ListGroup.Item
                key={task._id}
                className={`d-flex justify-content-between align-items-center 
                  ${task.completed ? 'bg-dark-3 text-light' : 'bg-dark-2'}`}
              >
                <div className="d-flex align-items-center">
                  <Form.Check
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleTaskCompletion(task)}
                    className="me-3"
                    id={`task-${task._id}`}
                  />
                  <label 
                    htmlFor={`task-${task._id}`}
                    className={`mb-0 text-light ${task.completed ? 'text-decoration-line-through' : ''}`}
                  >
                    {task.name}
                  </label>
                </div>
                <div>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => {
                      setEditingTask(task);
                      setTaskName(task.name);
                      setShowEditModal(true);
                    }}
                    className="me-2"
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => {
                      setTaskToDelete(task);
                      setShowModal(true);
                    }}
                  >
                    <FaTrash />
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Container>
      <Footer />

      {/* Delete Confirmation Modal */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)}
        centered
        contentClassName="bg-dark-2 text-light"
      >
        <Modal.Header closeButton className="border-secondary">
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the task: <strong className="text-warning">{taskToDelete?.name}</strong>?
        </Modal.Body>
        <Modal.Footer className="border-secondary">
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteTask}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Task Modal */}
      <Modal 
        show={showEditModal} 
        onHide={() => setShowEditModal(false)}
        centered
        contentClassName="bg-dark-2 text-light"
      >
        <Modal.Header closeButton className="border-secondary">
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="Enter new task name"
            className="bg-dark text-light border-secondary"
          />
        </Modal.Body>
        <Modal.Footer className="border-secondary">
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveEditedTask}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Custom CSS */}
      <style>{`
        .bg-dark-2 {
          background-color: #1e1e1e;
        }
        .bg-dark-3 {
          background-color: #252525;
        }
        .form-control.bg-dark {
          transition: all 0.2s ease;
        }
        .form-control.bg-dark:focus {
          background-color: #1e1e1e;
          border-color: #4a4a4a;
          color: white;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
        }
        .list-group-item {
          transition: all 0.2s ease;
        }
        .list-group-item:hover {
          background-color: #2a2a2a !important;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;