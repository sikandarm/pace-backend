const { body, param } = require("express-validator");

const caReportValidationRules = [
  body("originatorName").notEmpty().withMessage("is required"),
  body("contractorSupplier").notEmpty().withMessage("is required"),
  body("caReportDate").notEmpty().withMessage("is required"),
  body("ncNo").notEmpty().withMessage("is required"),
  body("purchaseOrderNo").notEmpty().withMessage("is required"),
  body("partDescription").notEmpty().withMessage("is required"),
  body("partId").notEmpty().withMessage("is required"),
  body("quantity")
    .notEmpty()
    .withMessage("is required")
    .isInt({ min: 1 })
    .withMessage("must be a positive integer"),
  body("dwgNo").notEmpty().withMessage("is required"),
  body("activityFound")
    .notEmpty()
    .withMessage("is required")
    .isArray({ min: 1 })
    .withMessage("Activity found must be an array with at least one activity"),
  body("description").notEmpty().withMessage("is required"),
  body("actionToPrevent").notEmpty().withMessage("is required"),
  body("disposition").notEmpty().withMessage("is required"),
  body("responsiblePartyName").notEmpty().withMessage("is required"),
  body("responsiblePartyDate").notEmpty().withMessage("is required"),
  body("correctiveActionDesc").notEmpty().withMessage("is required"),
  body("approvalName").notEmpty().withMessage("is required"),
  body("approvalDate").notEmpty().withMessage("is required"),
];

const paramValidationRules = [
  param("id")
    .notEmpty()
    .withMessage("is required.")
    .isInt()
    .withMessage("must be an integer."),
];

module.exports = {
  caReportValidationRules,
  paramValidationRules,
};
