const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // read token
  const token = req.header("x-auth-token");
  // check is not token
  if (!token) {
    return res.status(401).json({
      status: false,
      errors: "Token not valid",
    });
  }
  try {
    const cif = jwt.verify(token, process.env.SECRET);
    req.user = cif.user;
    next();
  } catch (error) {
    return res.status(401).json({
      status: false,
      errors: "Token not valid",
    });
  }

  // validate token
};
