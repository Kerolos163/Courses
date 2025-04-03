const express = require("express");
const routes = express.Router();
const usersController = require("../controllers/users.controller");
const verifyToken = require("../middleware/verifyToken");
const multer = require("multer");
const AppError = require("../utils/appErrors");
const httpStatus = require("../utils/http_status_text");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("File :==> ");
    console.log(file);
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    const filename = "user_" + Date.now() + "_" + file.originalname + "." + ext;
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  const imageType = file.mimetype.split("/")[0];
  if (imageType === "image") {
    return cb(null, true);
  } else {
    let err = new AppError(
      "Only image files are allowed",
      400,
      httpStatus.FAIL
    );
    return cb(err, false);
  }
};

const upload = multer({ storage: storage, fileFilter });

routes.route("/").get(verifyToken, usersController.getAllUsers);
routes
  .route("/register")
  .post(upload.single("avatar"), usersController.Register);
routes.route("/login").post(usersController.Login);

module.exports = routes;
