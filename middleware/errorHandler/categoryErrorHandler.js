const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

// Middleware function for user registration
const categoryCreateErrorHandler = async (req, res, next) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // Format validation errors for each field
        
        formattedErrors = {};


        errors.array().forEach(error => {
            formattedErrors[error.path]=error.msg;

        })
    
        return res.status(400).json({ errors: formattedErrors });
      }
      else{
        next();
      }
    } catch (error) {
      next(error);
    }
  };

  module.exports = {
    categoryCreateErrorHandler
  };

