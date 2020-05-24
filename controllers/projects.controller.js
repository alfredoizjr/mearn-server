const Project = require("../models/Project");
const Task = require("../models/Task");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

exports.createProject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      errors: errors.array(),
    });
  }
  try {
    // create project
    const project = new Project(req.body);
    project.autor = req.user;
    await project.save();
    return res.status(200).json({
      status: true,
      message: "Project was created sussefully",
      project,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: "Is in errors" });
  }
};

// GET ALL PROJECT OF THE USER AUTHENTICATED
exports.getProjects = async (req, res) => {
  try {
    let projects = await Project.find({ autor: req.user }).sort({
      createdAt: -1,
    });
    if (projects) {
      return res.status(200).json({
        status: true,
        projects,
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "any project was found",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: "Is in errors" });
  }
};

// UPDATE PROJECT
exports.updateProject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      errors: errors.array(),
    });
  }

  // get parameter of the request
  const { name } = req.body;
  const newProject = {};
  newProject.name = name;
  newProject.status = status;
  try {
    // check ID
    //Check id
    await Project.findById(req.params.id, (err, project) => {
      //Si el proyecto existe o no
      if (err || !project) {
        return res
          .status(404)
          .json({ status: false, message: "Not project was found" });
      }

      // verify the autor
      if (project.autor.toString() !== req.user) {
        return res.status(401).json({
          status: false,
          message: "Not autorized",
        });
      }
    });
    // update
    let updateProject = await Project.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: newProject },
      { new: true }
    );

    return res.status(200).json({
      status: true,
      updateProject,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: "Is in errors" });
  }
};
// DELETED PROJECT
exports.deletedProject = async (req, res) => {
  // cheks is id for mongoose
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res
      .status(400)
      .json({ status: false, errors: "The id is been pass is not supporter" });
  }
  try {
    await Project.findById(
      { _id: req.params.id.toString() },
      (err, project) => {
        if (err || !project) {
          console.log("error not project")
          return res
            .status(404)
            .json({ status: false, errors: "Not project was found" });
        }
        // verify the autor
        if (project.autor.toString() !== req.user) {
          return res.status(401).json({
            status: false,
            errors: "Not autorized",
          });
        }
      }
    );
    await Task.deleteMany({projectId: req.params.id.toString()});
    await Project.findByIdAndRemove({_id: req.params.id.toString()});
    return res.status(200).json({
      status: true,
      message: `The project was remove succefully`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: "Is in errors" });
  }
};
