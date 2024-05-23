const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const authenticate = require('../middleware/authentication/authenticate');
const taskValidation = require('../middleware/validation/taskValidation');
const { taskCreateErrorHandler } = require('../middleware/errorHandler/taskErrorHandler');
const nodemailer = require("nodemailer");


// Create a task
router.post('/create', authenticate, taskValidation, taskCreateErrorHandler,async (req, res) => {
  try {
    const { title, description, dueDate, priority } = req.body;
    // Create a new task
    const task = new Task({
      title,
      description,
      dueDate,
      priority,
      createdBy:req?.userId,
    });

    // Save the task to the database
    await task.save();

    res.status(201).json({ message: 'Task created successfully', task });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ errors:{
        message: 'Internal server error',
    } });
  }
});


// Fetch all tasks
router.get('/fetch', authenticate, async (req, res) => {
  try {
    // Retrieve all tasks from the database
    const tasks = await Task.find({ createdBy: req?.userId }).populate('category').populate('assignedTo');

    // Return the tasks as JSON
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ errors: { message: 'Internal server error' } });
  }
});

// Fetch all tasks
router.get('/fetch-assignedto-me', authenticate, async (req, res) => {
  try {
    // Retrieve all tasks from the database
    const tasks = await Task.find({ assignedTo: req?.userId }).populate('category').populate('assignedTo');

    // Return the tasks as JSON
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ errors: { message: 'Internal server error' } });
  }
});

// Delete a task
router.delete('/:taskId', authenticate, async (req, res) => {
  try {
    const taskId = req.params.taskId;
    // Check if the task exists
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ errors: { message: 'Task not found' } });
    }

    // Check if the authenticated user is the creator of the task
    // if (task.createdBy !== req.userId) {
    //   return res.status(403).json({ errors: { message: 'Unauthorized to delete this task' } });
    // }

    // Delete the task from the database
    await Task.findByIdAndDelete(taskId);

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ errors: { message: 'Internal server error' } });
  }
});

// Update a task
router.patch('/:taskId', authenticate, async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const updates = req.body;

    // Check if the task exists
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ errors: { message: 'Task not found' } });
    }

    // Update only the provided fields
    Object.keys(updates).forEach((key) => {
        task[key] = updates[key];
    });

    // Save the updated task to the database
    await task.save();


    if (updates["status"]) {
      try {
        const task = await Task.findById(taskId).populate("createdBy").populate("assignedTo");
        
        console.log(task?.createdBy?.email);
        const io = req.io;
        await io.emit('taskUpdate', { task, userId:req.userId });
    
      } catch (error) {
      }
    }
    

    res.status(200).json({ message: 'Task updated successfully', task });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ errors: { message: 'Internal server error' } });
  }
});


module.exports = router;
