const express = require("express");
const verifyJWT = require("../middlewares/verifyJWT");
const { paramValidationRules } = require("../validators/sequencesValidations");
const {
  getBill,
  // createBillItems,
  deleteBill,
  createBill,
} = require("../controllers/shippingListController");

const router = express.Router();

router.use(verifyJWT);

router.route("/get-bill").get(getBill);
// router.route("/create-bill-items").post(createBillItems);
router.route("/create-bill").post(createBill);
router.route("/delete-bill/:billTitle").delete(deleteBill);

module.exports = router;
