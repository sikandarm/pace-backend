const express = require("express");
const {
  createPurchaseOrder,
  updatePurchaseOrder,
  getAllPurchaseOrders,
  getPurchaseOrderById,
  deletePurchaseOrder,
  getPurchaseOrderByLoginUser,
  changeStatus
} = require("../controllers/purchaseOrderController");
const verifyJWT = require("../middlewares/verifyJWT");

const validate = require("../middlewares/validate");

const {
  purchaseOrderValidationRules,
  paramValidationRules,
} = require("../validators/purchaseValidatior");

const router = express.Router();

router.use(verifyJWT);

// MOBILE API's //

router.route("/getpurchaseOrder").get(getPurchaseOrderByLoginUser);
router.route("/changestatus/:id").patch(changeStatus);


router
  .route("/")
  .get(getAllPurchaseOrders)  
  .post(validate(purchaseOrderValidationRules), createPurchaseOrder);

router
  .route("/:id")
  .put(validate(purchaseOrderValidationRules), updatePurchaseOrder)
  .delete(validate(paramValidationRules), deletePurchaseOrder)
  .get(validate(paramValidationRules), getPurchaseOrderById);






module.exports = router;
