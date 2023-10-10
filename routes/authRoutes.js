const express = require('express');
const authController = require('../controllers/authController');
const requestLimiter = require('../middlewares/requestLimiter');
const verifyJWT = require('../middlewares/verifyJWT');

const router = express.Router();

router.route('/login').post(requestLimiter, authController.login);

// router.route('/refresh').get(authController.refresh);
// router.use(verifyJWT);
router.route('/logout').post(authController.logout);

module.exports = router;
