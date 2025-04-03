const AppError = require("../utils/appErrors");
const httpStatus = require("../utils/http_status_text");

module.exports = (...roles) => {
  console.log(roles);
  return (req, res, next) => {
    console.log("req.CurrentUser : ",req.currentUser);
    if (!roles.includes(req.currentUser.role)) {
      const err = new AppError(
        "You are not allowed to perform this action",
        403,
        httpStatus.FORBIDDEN
      );
      return next(err);
    }
    next();
  };
};
