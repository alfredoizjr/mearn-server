const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");

exports.authUser = async (req, res) => {
  // chek errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      errors: errors.array(),
    });
  }
  // get parameters from request body
  const { email, password } = req.body;

  try {
    const user = await User.findOne({email});
    // check if the user are in db
    if (!user) {
      return res
        .status(404)
        .json({ status: false, errors: "Wrong credential please try againg" });
    }
    // chek password
    const passCorrect = await bcryptjs.compare(password, user.password);
    if (!passCorrect) {
      return res
        .status(404)
        .json({ status: false, errors: "Wrong credential please try againg" });
    }

    // all cheking all correct create token
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
            message: "Login was sussefully",
            token,
          });
      }
    );

  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: false,
      erros: "Is an error",
    });
  }
};

// get user is authenticated

exports.userAuthenticated = async (req, res) => {
  try { 
    await User.findById(req.user,'name email',(err, user) => {
      if(err || !user){
        return res.status(404).json({
          status: false,
          errors: "User not found",
        });
      } else {
        return res.status(200).json({
          status: true,
          user,
        });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      errors: "Is an error",
    });
  }
}
