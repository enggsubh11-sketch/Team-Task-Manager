const express = require("express");
const { body } = require("express-validator");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const allowRoles = require("../middleware/roles");
const { createProject, getProjects, addMember } = require("../controllers/projectController");

const router = express.Router();

router.use(auth);

router.get("/", getProjects);

router.post(
  "/",
  allowRoles("Admin"),
  [body("name").notEmpty().withMessage("Project name is required.")],
  validate,
  createProject
);

router.post(
  "/:projectId/members",
  allowRoles("Admin"),
  [body("userId").notEmpty().withMessage("userId is required.")],
  validate,
  addMember
);

module.exports = router;
