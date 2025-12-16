import mongoose from 'mongoose';

/**
 * Middleware to validate MongoDB ObjectId parameters
 * Prevents CastError crashes from invalid IDs
 */
export function validateObjectId(paramName = 'id') {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (!id) {
      return next();
    }
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ${paramName} format`,
      });
    }
    next();
  };
}

/**
 * Middleware to validate an array of ObjectId parameters
 */
export function validateObjectIds(paramNames = []) {
  return (req, res, next) => {
    for (const paramName of paramNames) {
      const id = req.params[paramName];
      if (id && !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: `Invalid ${paramName} format`,
        });
      }
    }
    next();
  };
}
