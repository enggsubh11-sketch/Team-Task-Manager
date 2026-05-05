const Project = require("../models/Project");
const User = require("../models/User");

exports.createProject = async (req, res) => {
  const { name, description, memberIds = [] } = req.body;
  const members = [...new Set([...memberIds, req.user._id.toString()])];

  const project = await Project.create({
    name,
    description,
    createdBy: req.user._id,
    members,
  });

  return res.status(201).json(project);
};

exports.getProjects = async (req, res) => {
  const projects = await Project.find({ members: req.user._id })
    .populate("members", "name email role")
    .populate("createdBy", "name email role")
    .sort({ createdAt: -1 });

  return res.json(projects);
};

exports.addMember = async (req, res) => {
  const { projectId } = req.params;
  const { userId } = req.body;

  const project = await Project.findById(projectId);
  if (!project) {
    return res.status(404).json({ message: "Project not found." });
  }

  if (!project.createdBy.equals(req.user._id) && req.user.role !== "Admin") {
    return res.status(403).json({ message: "Only project owner/admin can add members." });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  if (!project.members.some((id) => id.equals(userId))) {
    project.members.push(userId);
    await project.save();
  }

  return res.json(project);
};
