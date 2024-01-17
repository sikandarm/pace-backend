const express = require("express");
const authController = require("../controllers/authController");
const requestLimiter = require("../middlewares/requestLimiter");
const verifyJWT = require("../middlewares/verifyJWT");

const router = express.Router();

router.route("/login").post(requestLimiter, authController.login);

router.route("/socialLogin").post(requestLimiter, authController.socialLogin);

router.route("/check-user-role/:email").get(authController.checkuserrole);
router.route("/check-user-phone/:email").get(authController.checkuserphone);
router.route("/check-fb-data/:Uid").get(authController.checkfbData);

// router.route('/refresh').get(authController.refresh);
// router.use(verifyJWT);
router.route("/logout").post(authController.logout);

module.exports = router;
