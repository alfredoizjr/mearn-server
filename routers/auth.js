const router = require("express").Router();
const { check } = require("express-validator");
const auth = require("../middlewares/auth.middleware");
// controllers
const authController = require("../controllers/auth.controller");

// authe user
// api/auth
router.post(
  "/",
  [
    check("email", "The email is not valid").isEmail(),
    check("password", "The password min is 6").isLength({ min: 6 }),
  ],
  authController.authUser
);

router.get("/", auth, authController.userAuthenticated);

module.exports = router;
