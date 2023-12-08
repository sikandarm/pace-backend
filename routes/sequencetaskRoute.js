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
  getnoassignsequence,
  getsequencebyid,
} = require("../controllers/sequenceTaskController");

router.use(verifyJWT);

router
  .route("/get-noassign-sequence/:id")
  .get(validate(paramValidationRules), getnoassignsequence);

router
  .route("/getsequenceandtask/:id")
  .get(validate(paramValidationRules), getsequencetask);

router
  .route("/indenpendent-task/:id")
  .get(validate(paramValidationRules), getIndependentTasks);

router
  .route("/updatesequencetask")
  .post(validate(sequencetaskValidationRules), updatesequencetask);

// WEB API'S //

router
  .route("/get-sequence-task/:id")
  .get(validate(paramValidationRules), getsequencebyid);

module.exports = router;
