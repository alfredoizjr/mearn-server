const router = require("express").Router();
const { check } = require("express-validator");
// controllers
const userController = require("../controllers/users.controller");

// Create user
// api/users
router.post(
  "/",
  [
    check("name", "The name field is required").not().isEmpty(),
    check("email", "The email is not valid").isEmail(),
    check("password", "The password min is 6").isLength({ min: 6 }),
  ],
  userController.createUser
);

module.exports = router;
