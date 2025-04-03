// const { body } = require("express-validator");

// const express = require("express");
// const routes = express.Router();

// const coursesController = require("../controllers/courses.controller");
// //! Get all courses
// routes.get("/", coursesController.GetAllCourses);

// //? Get course by ID
// routes.get("/:id", coursesController.GetCourseById);

// //! Add a new course
// routes.post(
//   "/",
//   [
//     body("name")
//       .notEmpty()
//       .withMessage("name is require")
//       .isLength({ min: 2 })
//       .withMessage("Title must be at least 2 characters long"),
//     body("price").notEmpty().withMessage("Price is required"),
//   ],
//   coursesController.AddCourse
// );

// //? Update a course
// routes.patch("/:id", coursesController.updateCourse);
// //! Delete a course
// routes.delete("/:id", coursesController.deleteCourse);

// module.exports = routes;

//! ================================= New Way =================================
const verifyToken = require("../middleware/verifyToken");
const allowTo = require("../middleware/allowedTo");
const role = require("../utils/userRoles");
const express = require("express");
const routes = express.Router();

const coursesController = require("../controllers/courses.controller");
const { courseMiddleware } = require("../middleware/courses.middleware");

routes
  .route("/")
  .get(coursesController.GetAllCourses)
  .post(courseMiddleware, verifyToken, coursesController.AddCourse);

routes
  .route("/:id")
  .get(coursesController.GetCourseById)
  .patch(coursesController.updateCourse)
  .delete(
    verifyToken,
    allowTo(role.ADMIN, role.MANAGER),
    coursesController.deleteCourse
  );

module.exports = routes;
