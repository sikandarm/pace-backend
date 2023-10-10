const express = require("express");
const {
  createJob,
  updateJob,
  getAlljob,
  getJob,
  deleteJob,
  exportJob,
  importJobs,
} = require("../controllers/jobController");
const verifyJWT = require("../middlewares/verifyJWT");

const validate = require("../middlewares/validate");

const {
  jobValidationRules,
  paramValidationRules,
} = require("../validators/jobValidator");

const router = express.Router();

router.use(verifyJWT);

router.route("/export").get(exportJob);
router.route("/import").post(importJobs);

router.route("/").post(validate(jobValidationRules), createJob).get(getAlljob);


router
  .route("/:id")
  .get(validate(paramValidationRules), getJob)
  .put(validate(jobValidationRules), updateJob)
  .delete(validate(paramValidationRules), deleteJob);

module.exports = router;
