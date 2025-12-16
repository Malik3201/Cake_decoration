import { body, validationResult } from 'express-validator';

/**
 * Middleware to check validation results and return errors
 */
export function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
}

/**
 * Registration validation rules
 */
export const registerValidator = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and a number'),
  handleValidationErrors,
];

/**
 * Login validation rules
 */
export const loginValidator = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors,
];

/**
 * Change password validation rules
 */
export const changePasswordValidator = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and a number'),
  handleValidationErrors,
];

/**
 * Update profile validation rules
 */
export const updateProfileValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  handleValidationErrors,
];

/**
 * Create order validation rules
 */
export const createOrderValidator = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
  body('items.*.product')
    .isMongoId()
    .withMessage('Invalid product ID'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('shippingAddress')
    .optional()
    .isObject()
    .withMessage('Shipping address must be an object'),
  body('shippingAddress.fullName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Full name is required for shipping'),
  body('shippingAddress.street')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),
  body('shippingAddress.city')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('shippingAddress.state')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  body('shippingAddress.postcode')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Postcode is required'),
  handleValidationErrors,
];

/**
 * Category validation rules
 */
export const createCategoryValidator = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Category name is required and must be under 100 characters'),
  body('description')
    .optional()
    .trim(),
  handleValidationErrors,
];

/**
 * Product validation rules
 */
export const createProductValidator = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Product title is required and must be under 200 characters'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('salePrice')
    .optional({ nullable: true })
    .custom((value, { req }) => {
      if (value !== null && value !== undefined && value !== '') {
        const numValue = parseFloat(value);
        if (isNaN(numValue) || numValue < 0) {
          throw new Error('Sale price must be a positive number');
        }
        if (numValue >= parseFloat(req.body.price)) {
          throw new Error('Sale price must be less than regular price');
        }
      }
      return true;
    }),
  body('category')
    .isMongoId()
    .withMessage('Valid category ID is required'),
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  handleValidationErrors,
];

/**
 * Update order status validation
 */
export const updateOrderStatusValidator = [
  body('status')
    .isIn(['pending', 'paid', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid order status'),
  handleValidationErrors,
];
