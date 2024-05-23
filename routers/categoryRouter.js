const express = require('express');
const router = express.Router(); 
const authenticate = require('../middleware/authentication/authenticate');
const categoryValidation = require('../middleware/validation/categoryValidation');
const { categoryCreateErrorHandler } = require('../middleware/errorHandler/categoryErrorHandler');
const Category = require('../models/Category');
const { default: mongoose } = require('mongoose');


// Create a category
router.post('/create', authenticate, categoryValidation, categoryCreateErrorHandler,async (req, res) => {
  try {
    const { name } = req.body;

    // Create a new category
    const category = new Category({
      name,
      createdBy:req?.userId,
    });

    // Save the category to the database
    await category.save();

    res.status(201).json({ message: 'Category created successfully', category });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ errors:{
        message: 'Internal server error',
    } });
  }
});


// Fetch all category
router.get('/fetch', authenticate, async (req, res) => {
  try {
    // Retrieve all category from the database
    const categories = await Category.find({createdBy:req?.userId});

    // Return the category as JSON
    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ errors: { message: 'Internal server error' } });
  }
});



// Delete a category
router.delete('/:categoryId', authenticate, async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    // Check if the task exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ errors: { message: 'Category not found' } });
    }

    //Check if the authenticated user is the creator of the category

    const userIdObject = new mongoose.Types.ObjectId(req.userId);
   
    console.log(req.userId)
    if (!category.createdBy.equals(userIdObject)) {
      return res.status(403).json({ errors: { message: 'Unauthorized to delete this category' } });
    }

    // Delete the task from the database
    await Category.findByIdAndDelete(categoryId);

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting ca:', error);
    res.status(500).json({ errors: { message: 'Internal server error' } });
  }
});


module.exports = router;
