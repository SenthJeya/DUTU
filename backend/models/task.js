const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const userTasksSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, 
  },
  tasks: {
    type: [taskSchema], 
  },
}, { timestamps: true });

const UserTasks = mongoose.model('UserTasks', userTasksSchema);

module.exports = UserTasks;
