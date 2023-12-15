const express = require("express");
const {
  createPurchaseOrderItem,
  getAllPurchaseOrderItems,
} = require("../controllers/purchaseOrderItemsController");
const verifyJWT = require("../middlewares/verifyJWT");

const validate = require("../middlewares/validate");

const {
  purchaseOrderItemValidator,
  //   paramValidationRules,
} = require("../validators/purchaseOrderItemValidator");

const router = express.Router();

router.use(verifyJWT);

router
  .route("/")
  .get(getAllPurchaseOrderItems)
  .post(validate(purchaseOrderItemValidator), createPurchaseOrderItem);
module.exports = router;
