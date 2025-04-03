var jwt = require("jsonwebtoken");
const appErrors = require("../utils/appErrors");
const httpStatus = require("../utils/http_status_text");

const VerifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.body.token;

  if (!authHeader) {
    let err = new appErrors("No token provided", 404, httpStatus.FAIL);
    return next(err);
  }

  const token = authHeader.split(" ")[1];
  console.log("authHeader :=> " + token);
  try {
    const CurrentUser = jwt.verify(token, process.env.JWT_SECRET);
    req.currentUser = CurrentUser;
    console.log(CurrentUser);
    next();
  } catch (error) {
    let err = new appErrors("Invalid token", 404, httpStatus.FAIL);
    return next(err);
  }
};

module.exports = VerifyToken;
