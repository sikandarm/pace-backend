const express = require("express");
const verifyJWT = require("../middlewares/verifyJWT");
const router = express.Router();
const {
  sequenceValidationRules,
  paramValidationRules,
} = require("../validators/sequencesValidations");
const validate = require("../middlewares/validate");

const {
  setbreaktask,
  breakstatus,
  breaktasklogs,
} = require("../controllers/breakTaskController");

router.use(verifyJWT);

router.route("/check-break-status/:id").get(breakstatus);
router.route("/check-break-logs/:id").get(breaktasklogs);
router.route("/set-task-break").post(setbreaktask);

module.exports = router;
