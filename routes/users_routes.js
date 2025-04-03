const express = require("express");
const routes = express.Router();
const usersController = require("../controllers/users.controller");
const verifyToken = require("../middleware/verifyToken");

routes.route("/").get(verifyToken,usersController.getAllUsers);
routes.route("/register").post(usersController.Register);
routes.route("/login").post(usersController.Login);

module.exports = routes;
