const { body, param } = require("express-validator");

// Validation rules for the Job model
const contactValidationRules = [
  body("firstName").notEmpty().withMessage("is required."),
  body("lastName").notEmpty().withMessage("is required."),
  body("email").isEmail().withMessage("Invalid email address."),
  body("phoneNumber").notEmpty().withMessage("Invalid PhoneNmber"),
];

const paramValidationRules = [
  param("id")
    .notEmpty()
    .withMessage("is required.")
    .isInt()
    .withMessage("must be an integer."),
];

module.exports = {
  contactValidationRules,
  paramValidationRules,
};
