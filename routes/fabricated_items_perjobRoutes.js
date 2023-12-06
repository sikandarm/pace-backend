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
  deletefabricateditems,
  updatefabricateditems,
  getallfebricateditems,
  getpoItems,
} = require("../controllers/fabricated_items_perjob");
const validate = require("../middlewares/validate");

router.use(verifyJWT);

// GET FabricatedITEMS BY JOB ID //
router
  .route("/get-fabricated-item/:id")
  .get(validate(paramValidationRules), getfebricateditems);

router.route("/create-fabricated-item").post(createfabricateditems);
router.route("/delete-fabricated-item/:id").delete(deletefabricateditems);
router.route("/update-fabricated-item/:id").put(updatefabricateditems);

router.route("/getall-fabricated-item").get(getallfebricateditems);

router.route("/get-poitem-perjob/:id").get(getpoItems);

module.exports = router;
