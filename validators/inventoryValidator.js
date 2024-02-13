const { body, param } = require("express-validator");

// Validation rules for the Inventory model
const inventoryValidationRules = [
  body("ediStdNomenclature").notEmpty().withMessage("is required."),
  body("aiscManualLabel").notEmpty().withMessage("is required."),
  body("shape")
    .notEmpty()
    .withMessage("is required.")
    .isIn([
      "2L",
      "C",
      "HP",
      "HSS",
      "L",
      "M",
      "MC",
      "MT",
      "PIPE",
      "S",
      "ST",
      "W",
      "WT",
    ])
    .withMessage("invalid shape."),
  body("weight")
    .notEmpty()
    .withMessage("is required.")
    .isDecimal({ decimal_digits: "2" })
    .withMessage("must be a decimal number with 2 decimal places."),
  body("depth")
    .notEmpty()
    .withMessage("is required.")
    .isDecimal({ decimal_digits: "2" })
    .withMessage("must be a decimal number with 2 decimal places."),
  body("grade")
    .notEmpty()
    .withMessage("is required.")
    .isString()
    // .isLength({ min: 5, max: 10 })
    .withMessage("must be a string"),
  body("poNumber")
    .notEmpty()
    .withMessage("is required.")
    // .isString()
    // .isLength({ min: 5, max: 10 })
    .withMessage("PO Number must be a Number"),
  body("heatNumber")
    .notEmpty()
    .withMessage("is required.")
    // .isString()
    // .isLength({ min: 5, max: 10 })
    .withMessage("must be a Number"),
  body("orderArrivedInFull")
    .notEmpty()
    .withMessage("is required.")
    .isBoolean()
    .withMessage("must be a boolean value."),
  body("orderArrivedCMTR")
    .notEmpty()
    .withMessage("is required.")
    .isBoolean()
    .withMessage("must be a boolean value."),
  body("itemType")
    .notEmpty()
    .withMessage("is required.")
    .isIn(["stock", "job"])
    .withMessage("invalid."),
  body("lengthReceivedFoot")
    .notEmpty()
    .withMessage("is required.")
    // .isInt({ min: 0, max: 99 })
    .withMessage("must be an integer"),
  body("lengthReceivedInch")
    .notEmpty()
    .withMessage("is required.")
    // .isInt({ min: 0, max: 99 })
    .withMessage("must be an integer"),
  body("quantity")
    .notEmpty()
    .withMessage("is required.")
    // .isInt({ min: 0, max: 100 })
    .withMessage("must be an integer"),
  body("poPulledFromNumber")
    .notEmpty()
    .withMessage("is required.")
    // .isString()
    // .isLength({ min: 5, max: 10 })
    .withMessage("must be a Number"),
  body("lengthUsedFoot")
    .notEmpty()
    .withMessage("is required.")
    // .isInt({ min: 0, max: 99 })
    .withMessage("must be an integer"),
  body("lengthUsedInch")
    .notEmpty()
    .withMessage("is required.")
    // .isInt({ min: 0, max: 99 })
    .withMessage("must be an integer"),
  body("lengthRemainingFoot")
    .notEmpty()
    .withMessage("is required.")
    // .isInt({ min: 0, max: 99 })
    .withMessage("must be an integer"),
  body("lengthRemainingInch")
    .notEmpty()
    .withMessage("is required.")
    // .isInt({ min: 0, max: 99 })
    .withMessage("must be an integer"),
];

const paramValidationRules = [
  param("id")
    .notEmpty()
    .withMessage("is required.")
    .isInt()
    .withMessage("must be an integer."),
];

module.exports = {
  inventoryValidationRules,
  paramValidationRules,
};
