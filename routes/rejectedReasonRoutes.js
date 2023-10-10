const express = require("express");
const rejectedReasonController = require("../controllers/rejectedReasonController");
const verifyJWT = require("../middlewares/verifyJWT");

const router = express.Router();

// router.use(verifyJWT);
router.route("/").get(rejectedReasonController.getAllReasons);

module.exports = router;
