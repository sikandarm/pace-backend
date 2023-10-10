const express = require("express");
const notificationController = require("../controllers/notificationController");
const verifyJWT = require("../middlewares/verifyJWT");

const router = express.Router();

// router.use(verifyJWT);
router.route("/").get(notificationController.getAllNotification);

module.exports = router;
