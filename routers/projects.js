const router = require("express").Router();
const { check } = require("express-validator");
const auth = require("../middlewares/auth.middleware");
// controllers
const projectController = require("../controllers/projects.controller");

// Create project
// api/projects
router.post("/",[
    auth,
    check("name","Name of project is required").not().isEmpty()
],projectController.createProject);
// get projects
router.get("/",[
    auth,
],projectController.getProjects);
// udate project
router.put("/:id",[
    auth,
    check("name","Name of project is required").not().isEmpty()
],projectController.updateProject);
// delete project
router.delete("/:id",[
    auth,
],projectController.deletedProject);

module.exports = router;
