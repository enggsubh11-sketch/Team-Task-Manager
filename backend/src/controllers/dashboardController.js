const Task = require("../models/Task");

exports.getDashboard = async (req, res) => {
  const now = new Date();
  const filter = req.user.role === "Member" ? { assignedTo: req.user._id } : {};

  const tasks = await Task.find(filter);

  const summary = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "Todo").length,
    inProgress: tasks.filter((t) => t.status === "In Progress").length,
    done: tasks.filter((t) => t.status === "Done").length,
    overdue: tasks.filter((t) => t.status !== "Done" && new Date(t.dueDate) < now).length,
  };

  return res.json(summary);
};
