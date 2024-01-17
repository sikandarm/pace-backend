const express = require("express");
// const verifyJWT = require("../middlewares/verifyJWT");
const { sendmail } = require("../controllers/rfiController");

const router = express.Router();
// router.use(verifyJWT);

router.route("/sendmail").post(sendmail);

module.exports = router;
