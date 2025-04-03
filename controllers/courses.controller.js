const { validationResult } = require("express-validator");
const course = require("../models/course_model");
const httpStatus = require("../utils/http_status_text");
const asyncWrapper = require("../middleware/asyncWrapper");
const appErrors = require("../utils/appErrors");

const GetAllCourses = asyncWrapper(async (req, res) => {
  let limit = req.query.limit ?? 10;
  let page = req.query.page ?? 1;
  const Courses = await course
    .find({}, { __v: 0 })
    .skip((page - 1) * limit)
    .limit(limit);
  // console.log(Courses);
  res.json({ status: httpStatus.SUCCESS, data: { Courses } });
});

const GetCourseById = asyncWrapper(async (req, res, next) => {
  const myCourse = await course.findById(req.params.id);
  if (!myCourse) {
    // return res.status(404).json({
    //   status: httpStatus.FAIL,
    //   data: { Courses: "Course not found" },
    // });

    // let err = new Error("Course not found");
    // err.statusCode = 404;
    // err.statusText = httpStatus.FAIL;
    let err = new appErrors("Course not found", 404, httpStatus.FAIL);
    return next(err);
  }
  res.json({ status: httpStatus.SUCCESS, data: { course: myCourse } });
});

const AddCourse = asyncWrapper(async (req, res, next) => {
  console.log(req.body);
  const errors = validationResult(req);
  // console.log(errors);
  if (!errors.isEmpty()) {
    // return res.status(400).json({
    //   status: httpStatus.FAIL,
    //   errors: errors.array(),
    // });

    const err = new appErrors(errors.array(), 400, httpStatus.FAIL);
    return next(err);
  }
  //! if (!req.body.name || !req.body.price) {
  //!   return res.status(400).json({ message: "Name and price are required" });
  //! }
  //! Courses.push({ id: Courses.length + 1, ...req.body });

  const newCourse = new course(req.body);
  await newCourse.save();
  res
    .status(201)
    .json({ status: httpStatus.SUCCESS, data: { course: newCourse } });
});

const updateCourse = asyncWrapper(async (req, res) => {
  const id = req.params.id;
  const updatedCourse = await course.updateOne(
    { _id: id },
    {
      $set: { ...req.body },
    }
  );
  res
    .status(200)
    .json({ status: httpStatus.SUCCESS, data: { course: updatedCourse } });
});

const deleteCourse = asyncWrapper(async (req, res) => {
  await course.deleteOne({ _id: req.params.id });

  res.status(200).json({
    status: httpStatus.SUCCESS,
    data: null,
  });
});

module.exports = {
  GetAllCourses,
  GetCourseById,
  AddCourse,
  updateCourse,
  deleteCourse,
};
