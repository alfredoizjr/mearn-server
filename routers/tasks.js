const router = require("express").Router();
const { check } = require("express-validator");
const auth = require("../middlewares/auth.middleware");
// controllers
const taskController = require("../controllers/tasks.controller");

// Create task
// api/tasks
router.post(
  "/",
  [
    auth,
    check("name", "The title is required").not().isEmpty(),
    check("projectId", "Project id is required").not().isEmpty(),
  ],
  taskController.createTask
);
// get tasks
router.get(
  "/",
  [auth, check("projectId", "Project id is required").not().isEmpty()],
  taskController.getTasks
);
// update task
router.put(
  "/:id",
  [
    auth,
    check("name", "The title is required").not().isEmpty(),
    check("projectId", "Project id is required").not().isEmpty(),
  ],
  taskController.updateTask
);

// delete task
router.delete("/:id", 
[
  auth,
  check("projectId", "Project id is required").not().isEmpty(),
], taskController.deletedTask);

module.exports = router;
