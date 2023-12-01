const express = require("express");
const verifyJWT = require("../middlewares/verifyJWT");
const router = express.Router();
const {
  sequenceValidationRules,
  paramValidationRules,
} = require("../validators/sequencesValidations");
const {
  getfebricateditems,
  createfabricateditems,
} = require("../controllers/fabricated_items_perjob");
const validate = require("../middlewares/validate");

router.use(verifyJWT);

router
  .route("/get-fabricated-item/:id")
  .get(validate(paramValidationRules), getfebricateditems);

router.route("/create-fabricated-item").post(createfabricateditems);

module.exports = router;
