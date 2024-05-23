const express = require('express');
const router = express.Router();
const TaskList = require('../models/TaskList');
const authenticate = require('../middleware/authentication/authenticate');

// Create a task list
router.post('/create', authenticate, async (req, res) => {
  try {
    const { name, tasks } = req.body;
    // Create a new task list
    const taskList = new TaskList({
      name,
      createdBy: req.userId,
      tasks
    });

    // Save the task list to the database
    await taskList.save();

    res.status(201).json({ message: 'Task list created successfully', taskList });
  } catch (error) {
    console.error('Error creating task list:', error);
    res.status(500).json({ errors: { message: 'Internal server error' } });
  }
});

// Fetch all task lists
router.get('/fetch', authenticate, async (req, res) => {
  try {
    // Retrieve all task lists created by the authenticated user
    const taskLists = await TaskList.find({ createdBy: req.userId }).populate('tasks');

    // Return the task lists as JSON
   
    res.status(200).json({ taskLists });
  } catch (error) {
    console.error('Error fetching task lists:', error);
    res.status(500).json({ errors: { message: 'Internal server error' } });
  }
});

// Delete a task list
router.delete('/:taskListId', authenticate, async (req, res) => {
  try {
    const taskListId = req.params.taskListId;
    // Check if the task list exists
    const taskList = await TaskList.findById(taskListId);
    if (!taskList) {
      return res.status(404).json({ errors: { message: 'Task list not found' } });
    }

    // Check if the authenticated user is the creator of the task list
    if (taskList.createdBy.toString() !== req.userId) {
      return res.status(403).json({ errors: { message: 'Unauthorized to delete this task list' } });
    }

    // Delete the task list from the database
    await TaskList.findByIdAndDelete(taskListId);

    res.status(200).json({ message: 'Task list deleted successfully' });
  } catch (error) {
    console.error('Error deleting task list:', error);
    res.status(500).json({ errors: { message: 'Internal server error' } });
  }
});

// Update a task list
router.patch('/:taskListId', authenticate, async (req, res) => {
  try {
    const taskListId = req.params.taskListId;
    const updates = req.body;

    // Check if the task list exists
    const taskList = await TaskList.findById(taskListId);
    if (!taskList) {
      return res.status(404).json({ errors: { message: 'Task list not found' } });
    }

    // Check if the authenticated user is the creator of the task list
    if (taskList.createdBy.toString() !== req.userId) {
      return res.status(403).json({ errors: { message: 'Unauthorized to update this task list' } });
    }

    // Update only the provided fields
    Object.keys(updates).forEach((key) => {
      taskList[key] = updates[key];
    });

    // Save the updated task list to the database
    await taskList.save();

    res.status(200).json({ message: 'Task list updated successfully', taskList });
  } catch (error) {
    console.error('Error updating task list:', error);
    res.status(500).json({ errors: { message: 'Internal server error' } });
  }
});

module.exports = router;
