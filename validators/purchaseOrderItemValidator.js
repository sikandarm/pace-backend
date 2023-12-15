const { body } = require("express-validator");

const purchaseOrderItemValidator = [
  body("quantity")
    .notEmpty()
    .withMessage("is required")
    .isInt()
    .withMessage("Quantity must be an integer"),
  body("po_id")
    .notEmpty()
    .withMessage("ID is required")
    .isInt()
    .withMessage("Purchase Order ID must be an integer"),
  body("inventory_id")
    .notEmpty()
    .withMessage("is required")
    .isInt()
    .withMessage("Inventory ID must be an integer"),
];
// const paramValidationRules = [
//   param("id")
//     .notEmpty()
//     .withMessage("is required.")
//     .isInt()
//     .withMessage("must be an integer."),
// ];

module.exports = {
  purchaseOrderItemValidator,
  // paramValidationRules,
};
