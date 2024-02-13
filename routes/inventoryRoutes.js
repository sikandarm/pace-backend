const express = require("express");
const {
  createInventory,
  updateInventory,
  getInventoryItems,
  getInventoryItem,
  deleteInventoryItem,
  exportInventory,
} = require("../controllers/inventoryController");
const verifyJWT = require("../middlewares/verifyJWT");
const validate = require("../middlewares/validate");

const {
  inventoryValidationRules,
  paramValidationRules,
} = require("../validators/inventoryValidator");

const router = express.Router();

// router.use(verifyJWT);
router.route("/export").get(exportInventory);

router
  .route("/")
  .post(validate(inventoryValidationRules), createInventory)
  .get(getInventoryItems);
router
  .route("/:id")
  .get(validate(paramValidationRules), getInventoryItem)
  .put(validate(inventoryValidationRules), updateInventory)
  .delete(validate(paramValidationRules), deleteInventoryItem);

module.exports = router;
