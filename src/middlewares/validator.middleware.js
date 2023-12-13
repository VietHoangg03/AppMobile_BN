const { body, validationResult } = require("express-validator");

const loginValidationRules = () => {
  return [
    body("email").isEmail().withMessage("Please enter a valid email address"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password has at least 8 characters long"),
  ];
};

const validateLogin = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
}; 

const registerValidationRules = () => {
  return [
    body("email").isEmail().withMessage("Please enter a valid email address"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password has at least 8 characters long"),
    body(
      "confirmPassword",
      "Confirm password field must have the same value as the password field"
    )
      .exists()
      .custom((value, { req }) => value === req.body.password),
  ];
};

const validateRegister = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
};

module.exports = {
  loginValidationRules,
  validateLogin,
  registerValidationRules,
  validateRegister,
};
