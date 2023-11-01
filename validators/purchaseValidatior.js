const { body, param } = require("express-validator");

const purchaseOrderValidationRules = [
  body("fax").notEmpty().withMessage("is required"),
  body("term").notEmpty().withMessage("is required"),
  body("email").notEmpty().withMessage("is required"),
  body("ship_to").notEmpty().withMessage("is required"),
  body("ship_via").notEmpty().withMessage("is required"),
  body("address").notEmpty().withMessage("is required."),
  body("po_number").notEmpty().withMessage("is required"),
  body("order_date").notEmpty().withMessage("is required"),
  body("vendor_name").notEmpty().withMessage("is required"),
  body("company_name").notEmpty().withMessage("is required"),
  body("delivery_date").notEmpty().withMessage("is required"),
  body("order_by").notEmpty().withMessage("orderBy is required"),
  body("placed_via").notEmpty().withMessage("placedVia is required"),
  body("confirm_with").notEmpty().withMessage("confirmWith is required"),
];
const paramValidationRules = [
  param("id")
    .notEmpty()
    .withMessage("is required.")
    .isInt()
    .withMessage("must be an integer."),
];

module.exports = {
  purchaseOrderValidationRules,
  paramValidationRules,
};
