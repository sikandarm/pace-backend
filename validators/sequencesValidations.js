const { body , param } = require("express-validator");

const sequenceValidationRules = [
  body("sequence_name").notEmpty().withMessage("is required"),
];
const paramValidationRules = [
  param("id")
    .notEmpty()
    .withMessage("is required.")
    .isInt()
    .withMessage("must be an integer."),
];

const sequencetaskValidationRules = [
  body("sequence_id").notEmpty().withMessage("is required"),
  body("task_id").notEmpty().withMessage("is required"),
];

module.exports = {
  sequenceValidationRules,
  paramValidationRules,
  sequencetaskValidationRules,
};