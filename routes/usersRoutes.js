const express = require("express");
const {
  createUser,
  updateUser,
  getAllUsers,
  getUser,
  deleteUser,
  userSignup,
  forgetPassword,
  verifyOTP,
  resetPassword,
  facebookLogin,
} = require("../controllers/usersController");
const verifyJWT = require("../middlewares/verifyJWT");
// const authorize = require('../middlewares/authorize');

const validate = require("../middlewares/validate");
// const verifyJWT = require("../middlewares/verifyJWT");

const {
  userValidationRules,
  paramValidationRules,
} = require("../validators/userValidator");

const router = express.Router();

router.route("/signup").post(userSignup);
router.route("/forget-password").post(forgetPassword);
router.route("/verify-otp").post(verifyOTP);
router.route("/reset-password").post(resetPassword);
router.route("/facebook").post(facebookLogin);

// router.use(verifyJWT);

router
  .route("/")
  .post(validate(userValidationRules), createUser)
  .get(getAllUsers);
router
  .route("/:id")
  .get(validate(paramValidationRules), getUser)
  .put(validate(userValidationRules), updateUser)
  .delete(validate(paramValidationRules), deleteUser);

module.exports = router;
