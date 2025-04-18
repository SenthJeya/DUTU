const express = require('express');
const UserTasks = require('../models/task');
const  verifyToken  = require('../middleware/auth'); // Middleware to verify JWT tokens

const router = express.Router();

// Create a new task
router.post('/create', verifyToken, async (req, res) => {
  const { name } = req.body;
  const userId = req.user.id; // Get the user ID from the token

  if (!name) {
    return res.status(400).json({ message: 'Task name is required' });
  }

  try {

    // Check if a document exists for the user in the UserTasks collection
    let userTaskDoc = await UserTasks.findOne({ userId });

    // If no document exists, create one
    if (!userTaskDoc) {
      userTaskDoc = new UserTasks({
        userId,
        tasks: [], // Initialize an empty array for tasks
      });
      await userTaskDoc.save();
    }

    // Check if the user has reached the maximum task limit
    if (userTaskDoc.tasks.length >= 25) {
      return res.status(400).json({ message: 'Maximum task limit of 25 reached' });
    }

    // Add the new task to the user's task array
    const newTask = { name, completed: false };
    userTaskDoc.tasks.push(newTask);
    await userTaskDoc.save();

    res.status(201).json({ message: 'Task created successfully', task: newTask });
  } catch (error) {
    console.error('Error creating task:', error); // Log the error in more detail
    res.status(500).json({ message: 'Server error', error: error.message }); // Send error message in the response
  }
});


// Delete a task
router.delete('/delete/:taskId', verifyToken, async (req, res) => {
  const { taskId } = req.params; // Get the task ID from the URL
  const userId = req.user.id;   // Get the user ID from the token

  try {
    // Find the user's document and remove the task from the array
    const result = await UserTasks.updateOne(
      { userId }, // Find the user document by userId
      { $pull: { tasks: { _id: taskId } } } // Remove the task with the matching _id from the tasks array
    );

    // Check if the task was successfully deleted
    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Task not found or you do not have permission' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

//Get all the task for the particular user
router.get('/get', verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const userTasks = await UserTasks.findOne({ userId });

    if (!userTasks) {
      return res.status(200).json([]); // Return empty array instead of 404
    }

    // Sort tasks so that:
    // 1. Newly created tasks are on top.
    // 2. Completed tasks appear last.
    const sortedTasks = userTasks.tasks.sort((a, b) => {
      // Sort by creation date, with newly created tasks on top
      if (a.createdAt !== b.createdAt) {
        return new Date(b.createdAt) - new Date(a.createdAt); // newest task first
      }
      // If creation dates are the same, then sort by completion status
      return a.completed === b.completed ? 0 : a.completed ? 1 : -1;
    });

    res.json(sortedTasks); // Send sorted tasks
  } catch (error) {

    res.status(500).json({ message: 'Server error' });
  }
});


//update task state
router.put('/update/:taskId', verifyToken, async (req, res) => {
  const { taskId } = req.params;
  const { completed } = req.body; // Get the 'completed' status from the request body
  const userId = req.user.id;

  try {
    // Find the task and update the 'completed' status in the tasks array
    const task = await UserTasks.findOneAndUpdate(
      { userId, 'tasks._id': taskId }, // Match the task by userId and taskId
      { $set: { 'tasks.$.completed': completed } }, // Update the 'completed' field of the matched task
      { new: true } // Return the updated document
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found or you do not have permission' });
    }

    res.json({ message: 'Task updated successfully', task });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


// Route to update task name
router.put('/edit/:taskId', verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { taskId } = req.params;
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: 'Task name cannot be empty' });
  }

  try {
    const result = await UserTasks.findOneAndUpdate(
      { userId, 'tasks._id': taskId },
      {
        $set: {
          'tasks.$.name': name,
          updatedAt: new Date()
        }
      },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    res.status(200).json({ message: 'Task updated successfully' });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;