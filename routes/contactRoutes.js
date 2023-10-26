const express = require("express");
const {
  createContact,
  updateContact,
  getAllcontact,
  getContact,
  deleteContact,
  //   exportJob,
  //   importJobs,
} = require("../controllers/contactController");
const verifyJWT = require("../middlewares/verifyJWT");

const validate = require("../middlewares/validate");

const {
  contactValidationRules,
  paramValidationRules,
} = require("../validators/contactValidator");

const router = express.Router();

router.use(verifyJWT);

// router.route("/export").get(exportJob);
// router.route("/import").post(importJobs);

router
  .route("/")
  .post(validate(contactValidationRules), createContact)
  .get(getAllcontact);

router
  .route("/:id")
  .get(validate(paramValidationRules), getContact)
  .put(validate(contactValidationRules), updateContact)
  .delete(validate(paramValidationRules), deleteContact);

module.exports = router;
