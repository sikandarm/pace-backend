const { body, param } = require("express-validator");

const vendorValidationRules = [
  body("vendor_name").notEmpty().withMessage("is required"),
];

const paramValidationRules = [
  param("id")
    .notEmpty()
    .withMessage("ID is required.")
    .isInt()
    .withMessage("ID must be an integer."),
];

module.exports = {
  vendorValidationRules,
  paramValidationRules,
};
