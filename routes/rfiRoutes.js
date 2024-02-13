const express = require("express");
// const verifyJWT = require("../middlewares/verifyJWT");
const {
  sendmail,
  uploadfile,
  getUploadFile,
  deleteUploadFIle,
} = require("../controllers/rfiController");

const router = express.Router();
// router.use(verifyJWT);

router.route("/sendmail").post(sendmail);
router.route("/sendfile").post(uploadfile);
router.route("/getfile").get(getUploadFile);
router.route("/deletefile/:id").delete(deleteUploadFIle);

module.exports = router;
