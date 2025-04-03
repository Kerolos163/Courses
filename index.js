//!====================================== CRUD ======================================
require("dotenv").config();
const cors = require("cors");
const httpStatus = require("./utils/http_status_text");
const mongoose = require("mongoose");
const url = process.env.MONGO_URL;

mongoose.connect(url).then(() => {
  console.log("Connected to MongoDB");
});

const express = require("express");
const app = express();
const portNumber = process.env.portNumber ?? 5000;

app.use(cors());
app.use(express.json()); //* Middleware to parse JSON request body

const coursesRouter = require("./routes/courses_routes");
const e = require("express");
app.use("/api/courses", coursesRouter);
const usersRouter = require("./routes/users_routes");
app.use("/api/users", usersRouter);

//! Global Middleware for Route not found
app.all("*", (req, res) => {
  res.status(404).json({
    status: httpStatus.ERROR,
    data: null,
    message: "Route not found",
  });
});

//? Global Middleware for Error Handler
app.use((error, req, res, next) => {
  res.status(error.statusCode ?? 500).json({
    status: error.statusText ?? httpStatus.ERROR,
    code: error.statusCode ?? 500,
    data: null,
    message: error.message,
  });
});

app.listen(portNumber, () => {
  console.log(`Server is running on ${portNumber}`);
});
