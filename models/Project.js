const mongoose = require("mongoose");

const ProjectSchema = mongoose.Schema({
  name: {
    require: true,
    type: String,
    trim: true,
  },
  autor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

},{timestamps: true});


module.exports = mongoose.model("Project", ProjectSchema);
