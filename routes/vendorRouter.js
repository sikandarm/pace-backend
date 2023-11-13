const express = require("express");
const {
  createVendor,
  updateVendor,
  getAllVendors,
  getVendor,
  deleteVendor,
} = require("../controllers/vendorController");
const verifyJWT = require("../middlewares/verifyJWT");

const validate = require("../middlewares/validate");

const {
  vendorValidationRules,
  paramValidationRules,
} = require("../validators/vendorValidations");

const router = express.Router();

router.use(verifyJWT);

router
  .route("/")
  .get(getAllVendors)
  .post(validate(vendorValidationRules), createVendor);

router
  .route("/:id")
  .put(validate(vendorValidationRules), updateVendor)
  .delete(validate(paramValidationRules), deleteVendor)
  .get(validate(paramValidationRules), getVendor);

module.exports = router;
