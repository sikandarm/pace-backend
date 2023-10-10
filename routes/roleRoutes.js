const express = require('express');
const roleController = require('../controllers/roleController');
const verifyJWT = require('../middlewares/verifyJWT');

const router = express.Router();

// router.use(verifyJWT);
router
  .route('/')
  .post(roleController.createRole)
  .get(roleController.getAllRoles);

router
  .route('/:id')
  .get(roleController.getRole)
  .put(roleController.updateRole)
  .delete(roleController.deleteRole);

module.exports = router;
