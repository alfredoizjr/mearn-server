const mongoose = require("mongoose");

const TaskSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  status: {
    type: Boolean,
    default: false,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
},{timestamps: true});

module.exports = mongoose.model("Task", TaskSchema);
