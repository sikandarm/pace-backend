const { body, param } = require("express-validator");

const companyValidationRules = [
  body("name").notEmpty().withMessage("is required"),
  body("address").notEmpty().withMessage("is required"),
  body("phone").notEmpty().withMessage("is required"),
  // body("fax").notEmpty().withMessage("is required"),
  body("email")
    .notEmpty()
    .withMessage("is required")
    .isEmail()
    .withMessage("Invalid email format"),
];

const paramValidationRules = [
  param("id")
    .notEmpty()
    .withMessage("ID is required.")
    .isInt()
    .withMessage("ID must be an integer."),
];

module.exports = {
  companyValidationRules,
  paramValidationRules,
};
