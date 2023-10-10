const express = require('express');
const permissionController = require('../controllers/permissionController');
const verifyJWT = require('../middlewares/verifyJWT');

const router = express.Router();

// router.use(verifyJWT);
router
    .route('/')
    .get(permissionController.getAllPermissions)
    .post(permissionController.createPermission);

router
    .route('/:id')
    .get(permissionController.getPermission)
    .put(permissionController.updatePermission)
    .delete(permissionController.deletePermission);

module.exports = router;
