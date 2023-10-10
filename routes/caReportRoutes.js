const express = require("express");
const {
  createCAReort,
  updateCAReport,
  getCAReport,
  getAllCAReports,
  deleteCAReport,
  createSharedReport,
  getSharedReportsByUserId,
  updateReportStatus,
} = require("../controllers/caReportController");

const validate = require("../middlewares/validate");

const {
  caReportValidationRules,
  paramValidationRules,
} = require("../validators/caReportValidator");

const router = express.Router();

router.route("/").post(createCAReort).get(getAllCAReports);

router
  .route("/:id")
  .put(validate(caReportValidationRules), updateCAReport)
  .get(validate(paramValidationRules), getCAReport)
  .delete(validate(paramValidationRules), deleteCAReport);

router.route("/shared").post(createSharedReport);

router.route("/shared/:userId").get(getSharedReportsByUserId);

router.route("/:reportId/status").put(updateReportStatus);

module.exports = router;
