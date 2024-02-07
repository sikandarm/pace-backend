const { body, param } = require("express-validator");

const isLettersOnly = (value) =>
  /^[A-Za-z\s]+$/.test(value) && /[A-Za-z]/.test(value);

const taskValidationRules = [
  body("jobId")
    .notEmpty()
    .withMessage("is required.")
    .custom((value, { req }) => {
      const parsedJobId = parseInt(value);
      if (isNaN(parsedJobId)) {
        throw new Error("must be an integer.");
      }
      req.body.jobId = parsedJobId;
      return true;
    }),
  // body("userId")
  //   .optional({ nullable: false })
  //   .isInt()
  //   .withMessage("must be an integer."),
  body("approvedBy")
    .optional({ nullable: true })
    .isInt()
    .withMessage("must be an integer."),
  body("status")
    .isIn(["in_process", "pending", "rejected", "approved", "to_inspect"])
    .withMessage("invalid status."),
  body("projectManager")
    .optional({ checkFalsy: true })
    .customSanitizer((value) => value.trim())
    .custom((value, { req }) => {
      if (!value) {
        return true;
      }
      if (isLettersOnly(value)) {
        return true;
      }
      return Promise.reject("must contain only letters");
    }),
  body("QCI")
    .optional({ checkFalsy: true })
    .customSanitizer((value) => value.trim())
    .custom((value, { req }) => {
      if (!value) {
        return true;
      }
      if (isLettersOnly(value)) {
        return true;
      }
      return Promise.reject("must contain only letters");
    }),
  body("fitter")
    .optional({ checkFalsy: true })
    .customSanitizer((value) => value.trim())
    .custom((value, { req }) => {
      if (!value) {
        return true;
      }
      if (isLettersOnly(value)) {
        return true;
      }
      return Promise.reject("must contain only letters");
    }),
  body("welder")
    .optional({ checkFalsy: true })
    .customSanitizer((value) => value.trim())
    .custom((value, { req }) => {
      if (!value) {
        return true;
      }
      if (isLettersOnly(value)) {
        return true;
      }
      return Promise.reject("must contain only letters");
    }),
  body("painter")
    .optional({ checkFalsy: true })
    .customSanitizer((value) => value.trim())
    .custom((value, { req }) => {
      if (!value) {
        return true;
      }
      if (isLettersOnly(value)) {
        return true;
      }
      return Promise.reject("must contain only letters");
    }),
  body("foreman")
    .optional({ checkFalsy: true })
    .customSanitizer((value) => value.trim())
    .custom((value, { req }) => {
      if (!value) {
        return true;
      }
      if (isLettersOnly(value)) {
        return true;
      }
      return Promise.reject("must contain only letters");
    }),
];

const paramValidationRules = [
  param("id")
    .notEmpty()
    .withMessage("is required.")
    .isInt()
    .withMessage("must be an integer."),
];
module.exports = { taskValidationRules, paramValidationRules };
