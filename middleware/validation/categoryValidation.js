const { body, validationResult } = require('express-validator');

const categoryValidation= [
  body('name').trim().notEmpty().withMessage('Name is required'),
];

module.exports=categoryValidation;
