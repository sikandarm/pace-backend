const express = require("express");
const verifyJWT = require("../middlewares/verifyJWT");
const router = express.Router();
const {
  sequenceValidationRules,
  paramValidationRules,
  sequencetaskValidationRules,
} = require("../validators/sequencesValidations");
const validate = require("../middlewares/validate");
const {
  getsequencetask,
  updatesequencetask,
  getIndependentTasks,
} = require("../controllers/sequenceTaskController");

router.use(verifyJWT);

router
  .route("/getsequenceandtask/:id")
  .get(validate(paramValidationRules), getsequencetask);

router
  .route("/indenpendent-task/:id")
  .get(validate(paramValidationRules), getIndependentTasks);

router
  .route("/updatesequencetask")
  .post(validate(sequencetaskValidationRules), updatesequencetask);

module.exports = router;
