const express = require("express");
const verifyJWT = require("../middlewares/verifyJWT");
const router = express.Router();
const {
  sequenceValidationRules,
  paramValidationRules,
} = require("../validators/sequencesValidations");
const validate = require("../middlewares/validate");

const { setbreaktask } = require("../controllers/breakTaskController");

router.use(verifyJWT);

router.route("/set-task-break").post(setbreaktask);

module.exports = router;
