const express = require("express");
const verifyJWT = require("../middlewares/verifyJWT");
const router = express.Router();
const { sequenceValidationRules , paramValidationRules } = require ("../validators/sequencesValidations")
const validate = require("../middlewares/validate");

const {
  getsequence,
  createsequencete,
  deletesequencete,
} = require("../controllers/sequenceController");

router.use(verifyJWT);

// MOBILEAPI'S //
router.route("/getsequence/:id").get(getsequence);
router.route("/createsequence").post(validate(sequenceValidationRules),createsequencete);
router.route("/deletesequence/:id").delete(validate(paramValidationRules),deletesequencete);

module.exports = router;
