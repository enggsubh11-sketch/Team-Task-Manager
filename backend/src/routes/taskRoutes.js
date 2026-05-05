const express = require("express");
const { body } = require("express-validator");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const { createTask, getTasks, updateTask } = require("../controllers/taskController");

const router = express.Router();

router.use(auth);

router.get("/", getTasks);

router.post(
  "/",
  [
    body("title").notEmpty().withMessage("Task title is required."),
    body("projectId").notEmpty().withMessage("projectId is required."),
    body("assignedTo").notEmpty().withMessage("assignedTo is required."),
    body("dueDate").isISO8601().withMessage("Valid dueDate is required."),
    body("status").optional().isIn(["Todo", "In Progress", "Done"]),
  ],
  validate,
  createTask
);

router.patch(
  "/:taskId",
  [body("status").optional().isIn(["Todo", "In Progress", "Done"])],
  validate,
  updateTask
);

module.exports = router;
