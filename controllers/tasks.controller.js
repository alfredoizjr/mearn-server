const Task = require("../models/Task");
const Project = require("../models/Project");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

// CREATE TASK
exports.createTask = async (req, res) => {
  // validate request parameters
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      errors: errors.array(),
    });
  }
  try {
    await Project.findById(req.body.projectId, (err, project) => {
      // chek is project exist
      if (err || !project) {
        return res.status(404).json({
          status: false,
          message: "Project not found",
        });
      }
      // verify the autor
      if (project.autor.toString() !== req.user) {
        return res.status(401).json({
          status: false,
          message: "Not autorized",
        });
      }
    });

    let task = new Task(req.body);
    await task.save();
    return res.status(200).json({
      status: true,
      task,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: "Is in errors" });
  }
};

// GET TASKS BY PROJECT ID
exports.getTasks = async (req, res) => {
  // validate request parameters
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      errors: errors.array(),
    });
  }
  // getting parameters from request body
  const { projectId } = req.query;
  try {
    await Task.find(
      { projectId },
      null,
      { sort: { createdAt: "desc" } },
      (err, tasks) => {
        if (err || !tasks) {
          return res.status(400).json({
            status: false,
            message: "Any task was found on this project",
          });
        }

        return res.status(200).json({
          status: true,
          tasks,
        });
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: "Is in errors" });
  }
};

exports.updateTask = async (req, res) => {
  // validate request parameters
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      errors: errors.array(),
    });
  }
  // get parameters from request
  const { name, status, projectId } = req.body;

  try {
    await Project.findById(projectId, (err, project) => {
      if (project.autor.toString() !== req.user) {
        return res.status(401).json({
          status: false,
          message: "Not autorized",
        });
      }
    });

    await Task.findById(req.params.id, (err, task) => {
      if (err || !task) {
        return res.status(404).json({
          status: false,
          message: "The task was not found",
        });
      }
    });

    // create object
    const newTask = {};
    if (name) newTask.name = name;
    if (status !== undefined) newTask.status = status;

    // update
    let task = await Task.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: newTask },
      { new: true }
    );

    return res.status(200).json({
      status: true,
      task,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: "Is in errors" });
  }
};

// DELETED TASK
exports.deletedTask = async (req, res) => {
  // validate request parameters
  const errors = validationResult(req.query);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      errors: errors.array(),
    });
  }
  // cheks is id for mongoose
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res
      .status(400)
      .json({ status: false, errors: "The id is been pass is not supporter" });
  }

  try {
    await Project.findById(req.query.projectId, (err, project) => {
      if (project.autor.toString() !== req.user) {
        return res.status(401).json({
          status: false,
          message: "Not autorized",
        });
      }
    });

    await Task.findById({ _id: req.params.id }, (err, task) => {
      if (err || !task) {
        return res
          .status(404)
          .json({ status: false, message: "Not task was found" });
      }
    });

    await Task.findOneAndRemove({ _id: req.params.id });
    return res.status(200).json({
      status: true,
      message: `The task was remove succefully`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: "Is in errors" });
  }
};
