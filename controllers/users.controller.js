const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  // check for errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      errors: errors.array(),
    });
  }
  // get parameter from request
  const {email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    // check if the user is alredy in db
    if (user) {
      return res
        .status(400)
        .json({ status: false, errors: "The user is alredy take" });
    }
    // create new user
    user = new User(req.body);

    // hasher password
    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(password, salt);

    // save user
    await user.save();
    // create jwt and sing it
    let payload = {
      user: user._id,
    };
    jwt.sign(
      payload,
      process.env.SECRET,
      {
        expiresIn: 3600,
      },
      (error, token) => {
        if (error) throw error;
        // confirm messages
        res
          .status(200)
          .json({
            status: true,
            errors: "User was created sussefully",
            token,
          });
      }
    );
  } catch (error) {
    res.status(500).send("Is has error");
    console.log(error);
  }
};
