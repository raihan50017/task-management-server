const { body, validationResult } = require('express-validator');

const taskValidation= [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('dueDate').notEmpty().withMessage('Invalid due date format'),
  body('priority').isIn(['Low', 'Medium', 'High']).withMessage('Priority must be one of: Low, Medium, High'),
  body('category').optional().isString().withMessage('Category must be a string'),
];

module.exports=taskValidation;
