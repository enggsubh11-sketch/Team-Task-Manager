const express = require("express");
const auth = require("../middleware/auth");
const allowRoles = require("../middleware/roles");
const User = require("../models/User");

const router = express.Router();

router.get("/", auth, allowRoles("Admin"), async (req, res) => {
  const users = await User.find().select("name email role");
  res.json(users);
});

module.exports = router;
