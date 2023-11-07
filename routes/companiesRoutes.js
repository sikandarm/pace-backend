const express = require("express");
const {
  createCompany,
  updateCompany,
  getAllCompanies,
  getCompany,
  deleteCompany,
} = require("../controllers/companiesController");
const verifyJWT = require("../middlewares/verifyJWT");

const validate = require("../middlewares/validate");

const {
  companyValidationRules,
  paramValidationRules,
} = require("../validators/companiesValidations");

const router = express.Router();

router.use(verifyJWT);

router
  .route("/")
  .get(getAllCompanies)
  .post(validate(companyValidationRules), createCompany);

router
  .route("/:id")
  .put(validate(companyValidationRules), updateCompany)
  .delete(validate(paramValidationRules), deleteCompany)
  .get(validate(paramValidationRules), getCompany);

module.exports = router;
