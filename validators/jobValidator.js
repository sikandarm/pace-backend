const { body, param } = require("express-validator");

// Validation rules for the Job model
const jobValidationRules = [
  body("status")
    .isIn(["in_process", "completed", "priority"])
    .withMessage("invalid"),
];

const paramValidationRules = [
  param("id")
    .notEmpty()
    .withMessage("is required.")
    .isInt()
    .withMessage("must be an integer."),
];

module.exports = {
  jobValidationRules,
  paramValidationRules,
};
