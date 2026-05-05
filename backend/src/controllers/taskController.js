const Project = require("../models/Project");
const Task = require("../models/Task");

exports.createTask = async (req, res) => {
  const { title, description, projectId, assignedTo, status, dueDate } = req.body;

  const project = await Project.findById(projectId);
  if (!project) {
    return res.status(404).json({ message: "Project not found." });
  }

  if (!project.members.some((member) => member.equals(req.user._id))) {
    return res.status(403).json({ message: "Not a project member." });
  }

  if (!project.members.some((member) => member.equals(assignedTo))) {
    return res.status(400).json({ message: "Assignee must be part of project." });
  }

  const task = await Task.create({
    title,
    description,
    project: projectId,
    assignedTo,
    createdBy: req.user._id,
    status: status || "Todo",
    dueDate,
  });

  return res.status(201).json(task);
};

exports.getTasks = async (req, res) => {
  const filter = {};

  if (req.query.projectId) {
    filter.project = req.query.projectId;
  }

  if (req.user.role === "Member") {
    filter.assignedTo = req.user._id;
  }

  const tasks = await Task.find(filter)
    .populate("project", "name")
    .populate("assignedTo", "name email role")
    .populate("createdBy", "name email role")
    .sort({ dueDate: 1 });

  return res.json(tasks);
};

exports.updateTask = async (req, res) => {
  const { taskId } = req.params;
  const updates = req.body;

  const task = await Task.findById(taskId).populate("project");
  if (!task) {
    return res.status(404).json({ message: "Task not found." });
  }

  const isProjectMember = task.project.members.some((id) => id.equals(req.user._id));
  if (!isProjectMember) {
    return res.status(403).json({ message: "Not allowed to update this task." });
  }

  if (req.user.role === "Member" && !task.assignedTo.equals(req.user._id)) {
    return res.status(403).json({ message: "Members can only update their assigned tasks." });
  }

  const allowed = ["title", "description", "status", "assignedTo", "dueDate"];
  allowed.forEach((field) => {
    if (updates[field] !== undefined) {
      task[field] = updates[field];
    }
  });

  await task.save();
  return res.json(task);
};
