const express = require("express");
const {
  createTask,
  updateTask,
  getAllTask,
  getTask,
  deleteTask,
  exportTask,
  approvedTask,
  rejectedTask,
  getRejectedTaskByMonthAndYear,
} = require("../controllers/taskController");

const validate = require("../middlewares/validate");
// const verifyJWT = require("../middlewares/verifyJWT");

const {
  taskValidationRules,
  paramValidationRules,
} = require("../validators/taskValidator");

const router = express.Router();

// router.use(verifyJWT);

router
  .route("/")
  .post(validate(taskValidationRules), createTask)
  .get(getAllTask);

router.route("/export").get(exportTask);

router.route("/rejected-task-by-month-year").get(getRejectedTaskByMonthAndYear);

router
  .route("/:id")
  .get(validate(paramValidationRules), getTask)
  .put(validate(taskValidationRules), updateTask)
  .delete(validate(paramValidationRules), deleteTask);

router.route("/:id/approved").patch(approvedTask);

router.route("/:id/rejected").patch(rejectedTask);



module.exports = router;
