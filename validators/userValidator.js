const { body, param } = require("express-validator");

const userValidationRules = [
  body("firstName").notEmpty().withMessage("is required."),
  body("email").isEmail().withMessage("Invalid email address."),
  // body("password").notEmpty().withMessage("is required."),
  body("ratePerHour").optional().isInt().withMessage("Invalid rate per hour."),
];

const paramValidationRules = [
  param("id")
    .notEmpty()
    .withMessage("is required.")
    .isInt()
    .withMessage("must be an integer."),
];

module.exports = {
  userValidationRules,
  paramValidationRules,
};
